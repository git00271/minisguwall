import os
import sys
import time
import json
import urllib.request
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

WORKSPACE_DIR = r"C:\Users\git00\workspace"
MINIS_IMAGES_DIR = os.path.join(WORKSPACE_DIR, "minis", "images")
OUTPUT_JSON = os.path.join(WORKSPACE_DIR, "minis", "scratch", "scraped_body_photos.json")

def download_image(url, save_path):
    try:
        # Resolve higher resolution from Naver CDN
        clean_url = url
        if "type=" in url:
            clean_url = url.split("type=")[0] + "type=w640"
        
        req = urllib.request.Request(
            clean_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            with open(save_path, 'wb') as f:
                f.write(response.read())
        print(f"Downloaded: {os.path.basename(save_path)}")
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def main():
    options = uc.ChromeOptions()
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--headless")
    
    driver = uc.Chrome(options=options)
    
    body_photos = []
    
    try:
        # Direct URL to visitor reviews of Guwol branch
        url = "https://pcmap.place.naver.com/place/1678935728/review/visitor"
        print(f"Navigating to Naver Place Reviews: {url}")
        driver.get(url)
        time.sleep(5)
        
        # Scroll down multiple times to load many reviews
        scroll_count = 120
        print(f"Scrolling down {scroll_count} times to load historical reviews...")
        for i in range(scroll_count):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1.0)
            
            # Click '더보기' (show more reviews) button if it appears
            try:
                more_btn = None
                for selector in [
                    (By.XPATH, "//a[contains(., '더보기')]"),
                    (By.XPATH, "//span[contains(., '더보기')]/.."),
                    (By.CSS_SELECTOR, "a[class*='fvw7F']"),
                    (By.CSS_SELECTOR, "a.fvwqf"),
                    (By.XPATH, "//a[contains(text(), '더보기')]"),
                    (By.XPATH, "//span[contains(text(), '더보기')]/ancestor::a")
                ]:
                    try:
                        btn = driver.find_element(*selector)
                        if btn and btn.is_displayed():
                            more_btn = btn
                            break
                    except:
                        pass
                
                if more_btn:
                    driver.execute_script("arguments[0].click();", more_btn)
                    print(f"Clicked '더보기' button to load more reviews (Scroll {i+1})")
                    time.sleep(1.2)
            except:
                pass

        # Spread review text if '더보기' (show more text) exists in reviews
        try:
            # Find any anchor containing "더보기" that is inside the list but not the main button
            spread_btns = driver.find_elements(By.XPATH, "//li//a[contains(., '더보기')]")
            for btn in spread_btns:
                try:
                    driver.execute_script("arguments[0].click();", btn)
                except:
                    pass
            print(f"Clicked {len(spread_btns)} text-expand buttons.")
        except Exception as e:
            print("No text expand buttons clicked:", e)
            
        # Find all review elements
        review_elements = driver.find_elements(By.CSS_SELECTOR, "li[class*='g27Yg']") # Typical Naver visitor review list item class
        if not review_elements:
            review_elements = driver.find_elements(By.CSS_SELECTOR, "li") # fallback
            
        print(f"Found {len(review_elements)} candidate review items.")
        
        count = 0
        
        for idx, elem in enumerate(review_elements):
            text = ""
            try:
                text_elem = elem.find_element(By.CSS_SELECTOR, "span[class*='zPfVt']")
                text = text_elem.text
            except:
                try:
                    text = elem.text
                except:
                    continue
            
            # Skip if text is empty
            if not text:
                continue
                
            # Filter specifically for body piercing reviews
            has_body_keyword = False
            for kw in ["배꼽", "쇄골", "더멀", "바디", "손가락", "손등", "가슴", "니플", "피어싱종류", "귀테리어"]:
                if kw in text:
                    has_body_keyword = True
                    break
            if "목" in text:
                clean_text = text.replace("목요일", "").replace("안목", "").replace("목표", "").replace("목소리", "").replace("화목", "")
                if "목" in clean_text:
                    has_body_keyword = True

            if has_body_keyword:
                # Find images in this specific review element
                img_elements = elem.find_elements(By.CSS_SELECTOR, "img")
                if img_elements:
                    print(f"\nMatch found in review {idx}: {text[:100]}...")
                    for img_elem in img_elements:
                        src = img_elem.get_attribute("src")
                        if not src or src.startswith("data:") or "emoji" in src or "place.map.naver" in src or "static.map" in src or "profile" in src or "avatar" in src:
                            continue
                            
                        # Resolve higher resolution from Naver CDN
                        clean_url = src
                        if "type=" in src:
                            clean_url = src.split("type=")[0] + "type=w640"
                            
                        # Avoid duplicates
                        if clean_url not in [item["original_url"] for item in body_photos]:
                            photo_id = f"body_photo_{count}"
                            body_photos.append({
                                "id": photo_id,
                                "original_url": clean_url,
                                "review_text": text
                            })
                            count += 1
                            print(f"Added photo URL: {clean_url[:80]}...")
                            
        print(f"\nFound {len(body_photos)} matching body review images.")
        
        # Save info
        os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(body_photos, f, ensure_ascii=False, indent=2)
            
        # Download images
        os.makedirs(MINIS_IMAGES_DIR, exist_ok=True)
        downloaded_count = 0
        for item in body_photos:
            filename = f"{item['id']}.jpg"
            save_path = os.path.join(MINIS_IMAGES_DIR, filename)
            
            # Download
            if download_image(item["original_url"], save_path):
                downloaded_count += 1
                
        print(f"Successfully downloaded {downloaded_count} body piercing photos.")
        
    except Exception as e:
        print(f"Error during scraping: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()

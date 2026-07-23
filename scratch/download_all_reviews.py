import os
import sys
import time
import json
import urllib.request
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By

WORKSPACE_DIR = r"C:\Users\git00\workspace"
MINIS_IMAGES_DIR = os.path.join(WORKSPACE_DIR, "minis", "images")
OUTPUT_JSON = os.path.join(WORKSPACE_DIR, "minis", "scratch", "all_reviews_photos.json")

def download_image(url, save_path):
    try:
        req = urllib.request.Request(
            url, 
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
    
    all_photos = []
    
    try:
        url = "https://pcmap.place.naver.com/place/1678935728/review/visitor"
        print(f"Navigating to Naver Place Reviews: {url}")
        driver.get(url)
        time.sleep(5)
        
        # Scroll down multiple times to load many reviews
        scroll_count = 60
        print(f"Scrolling down {scroll_count} times to load historical reviews...")
        for i in range(scroll_count):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1.2)
            try:
                more_btn = driver.find_element(By.CSS_SELECTOR, "a[class*='fvw7F']")
                driver.execute_script("arguments[0].click();", more_btn)
                time.sleep(1.2)
            except:
                pass

        # Spread review text if '더보기' (show more text) exists in reviews
        try:
            spread_btns = driver.find_elements(By.CSS_SELECTOR, "a[class*='rvCSr']")
            for btn in spread_btns:
                try:
                    driver.execute_script("arguments[0].click();", btn)
                except:
                    pass
            print(f"Clicked {len(spread_btns)} text-expand buttons.")
        except Exception as e:
            pass
            
        review_elements = driver.find_elements(By.CSS_SELECTOR, "li[class*='g27Yg']")
        if not review_elements:
            review_elements = driver.find_elements(By.CSS_SELECTOR, "li")
            
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
            
            img_elements = elem.find_elements(By.CSS_SELECTOR, "img")
            if img_elements:
                for img_elem in img_elements:
                    src = img_elem.get_attribute("src")
                    if not src:
                        continue
                    
                    # Filter out base64 images and Naver emojis
                    if src.startswith("data:") or "emoji" in src or "static.map" in src or "profile" in src or "avatar" in src:
                        continue
                        
                    # Naver Place image resolver
                    clean_src = src
                    if "type=" in src:
                        clean_src = src.split("type=")[0] + "type=w640"
                        
                    if clean_src not in [item["original_url"] for item in all_photos]:
                        photo_id = f"review_photo_{count}"
                        all_photos.append({
                            "id": photo_id,
                            "original_url": clean_src,
                            "review_text": text
                        })
                        count += 1
                        
        print(f"\nFound {len(all_photos)} clean review images.")
        
        # Save info
        os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(all_photos, f, ensure_ascii=False, indent=2)
            
        # Download images
        os.makedirs(MINIS_IMAGES_DIR, exist_ok=True)
        for item in all_photos:
            filename = f"{item['id']}.jpg"
            save_path = os.path.join(MINIS_IMAGES_DIR, filename)
            download_image(item["original_url"], save_path)
            
        print("Review photos download complete.")
        
    except Exception as e:
        print(f"Error during scraping: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()

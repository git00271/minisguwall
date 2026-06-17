import os
import json
import requests
import subprocess
from PIL import Image
from io import BytesIO
from deep_translator import GoogleTranslator

# Target languages mapping for deep-translator
LANG_MAP = {
    "en": "en",
    "ja": "ja",
    "ru": "ru",
    "ar": "ar",
    "zh": "zh-CN"
}

def extract_shortcode(url):
    if not url:
        return ""
    url = url.rstrip('/')
    parts = url.split('/')
    if len(parts) >= 1:
        return parts[-1]
    return ""

def classify_category(caption):
    if not caption:
        return "ear"
    caption_lower = caption.lower()
    
    body_keywords = ["배꼽", "바디", "쇄골", "더멀", "dermal", "belly", "navel", "collarbone", "대이비스"]
    face_keywords = ["입술", "셉텀", "눈썹", "코피어싱", "보조개", "lip", "septum", "eyebrow", "nose", "dahlia", "medusa", "달리아", "메두사", "딩플"]
    
    if any(k in caption_lower for k in body_keywords):
        return "body"
    elif any(k in caption_lower for k in face_keywords):
        return "face"
    return "ear"

def translate_caption(text):
    translations = {"ko": text}
    if not text:
        for lang in LANG_MAP.keys():
            translations[lang] = ""
        return translations

    print(f"Translating caption: {text[:30]}...")
    for lang_code, translator_code in LANG_MAP.items():
        try:
            translated = GoogleTranslator(source='ko', target=translator_code).translate(text)
            translations[lang_code] = translated
            print(f" -> Translated to {lang_code} successfully.")
        except Exception as e:
            print(f" -> Failed to translate to {lang_code}: {e}")
            translations[lang_code] = text  # fallback to Korean
            
    return translations

def main():
    access_token = os.environ.get("INSTAGRAM_ACCESS_TOKEN")
    business_account_id = os.environ.get("INSTAGRAM_BUSINESS_ACCOUNT_ID")
    
    synced_json_path = os.path.join("images", "instagram_synced.json")
    
    # Load already synced posts
    if os.path.exists(synced_json_path):
        with open(synced_json_path, "r", encoding="utf-8") as f:
            try:
                synced_posts = json.load(f)
            except Exception:
                synced_posts = []
    else:
        synced_posts = []
        
    synced_ids = {post["id"] for post in synced_posts}
    
    # Also load curated posts from translate_data.py to extract shortcodes (prevent duplicates)
    curated_shortcodes = set()
    try:
        # We can extract curated links from translate_data.py by simple parsing
        with open("translate_data.py", "r", encoding="utf-8") as f:
            for line in f:
                if '"link":' in line:
                    # extract link url
                    # e.g., "link": "https://www.instagram.com/.../"
                    start_idx = line.find('"link":') + 8
                    end_idx = line.find('"', start_idx)
                    link_url = line[start_idx:end_idx]
                    shortcode = extract_shortcode(link_url)
                    if shortcode:
                        curated_shortcodes.add(shortcode)
    except Exception as e:
        print(f"Warning: Could not parse translate_data.py for curated links: {e}")

    # Dry-run / Mock mode if credentials are missing
    if not access_token or not business_account_id:
        print("INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_BUSINESS_ACCOUNT_ID not set in environment.")
        print("Running in DRY-RUN / MOCK mode...")
        
        # Create a mock post if there are no posts in synced_posts
        mock_id = "mock_12345"
        if mock_id not in synced_ids and "p/mock_shortcode" not in curated_shortcodes:
            print("Generating a mock synced post for validation...")
            mock_caption = "안녕하세요! 미니스 피어싱 구월점 귀테리어 세팅 예시입니다. 반짝이는 사선 피어싱과 귓바퀴 조합 이쁘죠? ♥ #귀피어싱 #귀테리어"
            mock_post = {
                "id": mock_id,
                "category": classify_category(mock_caption),
                "image": f"images/sync_{mock_id}.webp",
                "link": "https://www.instagram.com/p/mock_shortcode/",
                "description": translate_caption(mock_caption),
                "timestamp": "2026-06-17T19:00:00+0900"
            }
            # Create a mock webp image from a solid color if it doesn't exist
            mock_image_path = os.path.join("images", f"sync_{mock_id}.webp")
            if not os.path.exists(mock_image_path):
                img = Image.new('RGB', (400, 400), color = (73, 109, 137))
                img.save(mock_image_path, "WEBP", quality=75)
                print(f"Created mock WebP image at {mock_image_path}")
                
            synced_posts.append(mock_post)
            with open(synced_json_path, "w", encoding="utf-8") as f:
                json.dump(synced_posts, f, ensure_ascii=False, indent=2)
            print("Successfully saved mock post to instagram_synced.json.")
            
            # Run translate_data.py to rebuild
            print("Running translate_data.py...")
            subprocess.run(["python", "translate_data.py"], check=True)
        else:
            print("Mock post already exists or is duplicated. Skipping.")
        return

    # Normal sync mode using Instagram Graph API
    url = f"https://graph.facebook.com/v19.0/{business_account_id}/media"
    params = {
        "fields": "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
        "access_token": access_token,
        "limit": 20
    }
    
    print("Fetching posts from Instagram Graph API...")
    response = requests.get(url, params=params)
    if response.status_code != 200:
        print(f"Error fetching from Graph API: {response.status_code}")
        print(response.text)
        return
        
    media_items = response.json().get("data", [])
    print(f"Fetched {len(media_items)} items.")
    
    new_posts_added = 0
    
    # Process items in chronological order (oldest first) so they append in correct order
    for item in reversed(media_items):
        media_id = item.get("id")
        media_type = item.get("media_type")
        permalink = item.get("permalink", "")
        caption = item.get("caption", "")
        timestamp = item.get("timestamp")
        
        shortcode = extract_shortcode(permalink)
        
        # Check if already synced or exists in curated posts
        if media_id in synced_ids:
            continue
        if shortcode and shortcode in curated_shortcodes:
            print(f"Skipping post {media_id} (shortcode {shortcode}) as it is already in curated posts.")
            continue
            
        print(f"Processing new post ID: {media_id} ({permalink})")
        
        # Decide which URL to use for image
        img_url = item.get("thumbnail_url") if media_type == "VIDEO" else item.get("media_url")
        if not img_url:
            print(f"No image url found for {media_id}. Skipping.")
            continue
            
        # Download image
        try:
            img_res = requests.get(img_url, timeout=15)
            if img_res.status_code != 200:
                print(f"Failed to download image from {img_url}. Status code: {img_res.status_code}")
                continue
                
            # Convert to WebP
            img = Image.open(BytesIO(img_res.content))
            webp_path = os.path.join("images", f"sync_{media_id}.webp")
            img.save(webp_path, "WEBP", quality=75)
            print(f"Downloaded and converted image to {webp_path}")
        except Exception as e:
            print(f"Error processing image for post {media_id}: {e}")
            continue
            
        # Classify category
        category = classify_category(caption)
        print(f"Classified category: {category}")
        
        # Translate caption
        translations = translate_caption(caption)
        
        # Append to synced database
        new_post = {
            "id": f"sync_{media_id}",
            "category": category,
            "image": f"images/sync_{media_id}.webp",
            "link": permalink,
            "description": translations,
            "timestamp": timestamp
        }
        synced_posts.append(new_post)
        new_posts_added += 1
        
    if new_posts_added > 0:
        print(f"Added {new_posts_added} new posts to synced database.")
        with open(synced_json_path, "w", encoding="utf-8") as f:
            json.dump(synced_posts, f, ensure_ascii=False, indent=2)
            
        # Run translate_data.py to rebuild
        print("Running translate_data.py to rebuild posts_data.js...")
        subprocess.run(["python", "translate_data.py"], check=True)
    else:
        print("No new posts found to sync.")

if __name__ == "__main__":
    main()

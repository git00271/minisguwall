import os
import json
import requests
import sys
import subprocess
import base64
import uuid
from PIL import Image
from io import BytesIO
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator

# Reconfigure stdout to use UTF-8 to prevent encoding errors on Windows when printing emojis
sys.stdout.reconfigure(encoding='utf-8')

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

def shortcode_to_id(shortcode):
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    media_id = 0
    for char in shortcode:
        try:
            media_id = (media_id * 64) + alphabet.index(char)
        except ValueError:
            return 0
    return media_id

def id_to_shortcode(media_id):
    media_id = int(str(media_id).split('_')[0])
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    shortcode = ''
    while media_id > 0:
        media_id, remainder = divmod(media_id, 64)
        shortcode = alphabet[remainder] + shortcode
    return shortcode

def classify_category(caption):
    if not caption:
        return "ear"
    caption_lower = caption.lower()
    
    body_keywords = ["배꼽", "바디", "쇄골", "더멀", "dermal", "belly", "navel", "collarbone", "대이비스", "플랫서페이스", "플렛서페이스", "서페이스", "surface", "손가락", "finger", "가슴", "chest", "목", "neck", "손목", "wrist"]
    face_keywords = ["입술", "셉텀", "눈썹", "코피어싱", "보조개", "lip", "septum", "eyebrow", "nose", "dahlia", "medusa", "달리아", "메두사", "딩플", "셉텀피어싱", "눈썹피어싱", "코", "피어싱코", "입술피어싱", "피어싱입술", "보조개피어싱", "혀", "tongue", "혀피어싱", "딤플", "dimple"]
    
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
        with open("translate_data.py", "r", encoding="utf-8") as f:
            for line in f:
                if '"link":' in line:
                    start_idx = line.find('"link":') + 8
                    end_idx = line.find('"', start_idx)
                    link_url = line[start_idx:end_idx]
                    shortcode = extract_shortcode(link_url)
                    if shortcode:
                        curated_shortcodes.add(shortcode)
    except Exception as e:
        print(f"Warning: Could not parse translate_data.py for curated links: {e}")
    # Primary API: storynavigation.com
    parsed_items = []
    success_api = False
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko,en-US;q=0.9,en;q=0.8'
    }
    
    try:
        print("Fetching posts from storynavigation.com API...")
        session = requests.Session()
        profile_url = "https://storynavigation.com/user/guwall.minis"
        
        # Load user page to establish session and extract CSRF token
        page_res = session.get(profile_url, headers=headers, timeout=15)
        if page_res.status_code == 200:
            soup = BeautifulSoup(page_res.text, 'html.parser')
            csrf_tag = soup.find('meta', {'name': 'csrf-token'})
            if csrf_tag:
                csrf_token = csrf_tag.get('content')
                
                # Fetch medias JSON using the extracted CSRF token
                medias_url = "https://storynavigation.com/get-user-medias"
                medias_headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'X-CSRF-TOKEN': csrf_token,
                    'Referer': profile_url
                }
                payload = {"user_name": "guwall.minis"}
                post_res = session.post(medias_url, json=payload, headers=medias_headers, timeout=15)
                
                if post_res.status_code == 200:
                    medias_data = post_res.json()
                    if isinstance(medias_data, list):
                        print(f"Successfully retrieved {len(medias_data)} items from storynavigation.")
                        for post in medias_data:
                            shortcode = post.get("id") # E.g., DbFqKBvhz3L
                            if not shortcode:
                                continue
                            
                            b64_url = post.get("thumbnailUrl")
                            if not b64_url:
                                continue
                                
                            try:
                                img_url = base64.b64decode(b64_url).decode('utf-8')
                            except Exception:
                                continue
                                
                            caption = post.get("caption", "")
                            
                            # Re-construct a numeric media_id for chronological sorting helpers
                            media_id = shortcode_to_id(shortcode)
                            
                            parsed_items.append({
                                "shortcode": shortcode,
                                "media_id": media_id,
                                "img_url": img_url,
                                "caption": caption
                            })
                        success_api = True
    except Exception as e:
        print(f"Warning: Failed to fetch from storynavigation API: {e}")

    # Fallback API: insta-story.com
    if not success_api:
        print("Falling back to insta-story.com API...")
        url = "https://insta-story.com/api/v1/web/profile"
        visitor_id = str(uuid.uuid4())
        payload = {
            "username": "guwall.minis",
            "visitor_id": visitor_id
        }
        fallback_headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
        }
        
        try:
            res = requests.post(url, json=payload, headers=fallback_headers, timeout=15)
            if res.status_code == 200:
                data = res.json()
                # Handle posts list being None
                posts = data.get("posts") or []
                print(f"Found {len(posts)} items on fallback API.")
                for post in posts:
                    media_id_str = post.get("id")
                    if not media_id_str:
                        continue
                    media_id = int(media_id_str.split('_')[0])
                    shortcode = id_to_shortcode(media_id)
                    source_b64 = post.get("source")
                    if not source_b64:
                        continue
                    try:
                        img_url = base64.b64decode(source_b64).decode('utf-8')
                    except Exception:
                        continue
                        
                    parsed_items.append({
                        "shortcode": shortcode,
                        "media_id": media_id,
                        "img_url": img_url,
                        "caption": "" # No captions available on fallback API
                    })
            else:
                print(f"Fallback API failed with status: {res.status_code}")
        except Exception as e:
            print(f"Error calling fallback API: {e}")
        
    synced_ids = {post["id"] for post in synced_posts}
    
    # Pre-define current timestamp for new posts
    from datetime import datetime, timezone, timedelta
    kst = timezone(timedelta(hours=9))
    current_time_str = datetime.now(kst).strftime("%Y-%m-%dT%H:%M:%S%z")

    new_posts_added = 0

    # Process items in chronological order (oldest first) so they append in correct order in database
    for item in reversed(parsed_items):
        shortcode = item["shortcode"]
        post_id = f"sync_{shortcode}"
        permalink = f"https://www.instagram.com/p/{shortcode}/"
        
        # Check if already synced or exists in curated posts
        if post_id in synced_ids:
            continue
        if shortcode and shortcode in curated_shortcodes:
            print(f"Skipping post {post_id} (shortcode {shortcode}) as it is already in curated posts.")
            continue
            
        print(f"Processing new post ID: {post_id} ({permalink})")
        
        # Download image
        try:
            img_res = requests.get(item["img_url"], headers=headers, timeout=15)
            if img_res.status_code != 200:
                print(f"Failed to download image from {item['img_url']}. Status code: {img_res.status_code}")
                continue
                
            # Convert to WebP
            img = Image.open(BytesIO(img_res.content))
            webp_path = os.path.join("images", f"sync_{shortcode}.webp")
            img.save(webp_path, "WEBP", quality=75)
            print(f"Downloaded and converted image to {webp_path}")
        except Exception as e:
            print(f"Error processing image for post {post_id}: {e}")
            continue
            
        # Classify category
        caption = item.get("caption")
        if not caption:
            caption = "#구월동피어싱 #인천피어싱 #피어싱 #미니스피어싱 by @guwall.minis"
        category = classify_category(caption)
        print(f"Classified category: {category}")
        
        # Translate caption
        translations = translate_caption(caption)
        
        # Append to synced database
        new_post = {
            "id": post_id,
            "category": category,
            "image": f"images/sync_{shortcode}.webp",
            "link": permalink,
            "description": translations,
            "timestamp": current_time_str
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

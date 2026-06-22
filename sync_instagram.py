import os
import json
import requests
import sys
import subprocess
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

    # Fetch from Imginn public viewer
    url = "https://imginn.com/guwall.minis/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko,en-US;q=0.9,en;q=0.8'
    }
    
    print("Fetching posts from Imginn public viewer...")
    res = requests.get(url, headers=headers, timeout=15)
    if res.status_code != 200:
        print(f"Error fetching from Imginn: {res.status_code}")
        return
        
    soup = BeautifulSoup(res.text, 'html.parser')
    items = soup.find_all(class_='item')
    print(f"Found {len(items)} items on Imginn.")
    
    # 1. Parse scraped items to get shortcodes and decoded media IDs
    parsed_items = []
    for item in items:
        a_tag = item.find('a')
        if not a_tag:
            continue
        href = a_tag.get('href', '')
        if not href or '/p/' not in href:
            continue
        shortcode = extract_shortcode(href)
        if shortcode:
            parsed_items.append((item, shortcode, shortcode_to_id(shortcode)))
            
    # 2. Identify pinned posts (a post is pinned if there exists any post after it in profile order with a larger ID)
    pinned_shortcodes = set()
    non_pinned_items = []
    for idx, (item, shortcode, media_id) in enumerate(parsed_items):
        is_pinned = False
        for _, _, later_media_id in parsed_items[idx+1:]:
            if later_media_id > media_id:
                is_pinned = True
                break
        if is_pinned:
            print(f"Detected pinned post: {shortcode} (excluding)")
            pinned_shortcodes.add(shortcode)
        else:
            non_pinned_items.append(item)
            
    print(f"Filtered feed: {len(non_pinned_items)} non-pinned items out of {len(parsed_items)} total.")
    
    new_posts_added = 0
    
    # Self-healing clean-up: if any currently pinned post was previously synced, remove it and delete its images
    updated_synced_posts = []
    removed_any_pinned = False
    for post in synced_posts:
        post_shortcode = post["id"].replace("sync_", "")
        if post_shortcode in pinned_shortcodes:
            print(f"Removing previously synced pinned post from database: {post['id']}")
            # Delete original and mobile WebP image files
            for img_path in [post["image"], post["image"].replace("images/", "images/mobile/")]:
                if os.path.exists(img_path):
                    try:
                        os.remove(img_path)
                        print(f"Deleted image: {img_path}")
                    except Exception as e:
                        print(f"Error deleting image {img_path}: {e}")
            removed_any_pinned = True
        else:
            updated_synced_posts.append(post)
            
    if removed_any_pinned:
        synced_posts = updated_synced_posts
        # Force a rewrite by setting new_posts_added to at least 1
        new_posts_added = max(new_posts_added, 1)
        
    synced_ids = {post["id"] for post in synced_posts}

    # Process items in chronological order (oldest first) so they append in correct order in database
    for item in reversed(non_pinned_items):
        # Extract post link
        a_tag = item.find('a')
        if not a_tag:
            continue
        href = a_tag.get('href', '')
        if not href or '/p/' not in href:
            continue
            
        shortcode = extract_shortcode(href)
        post_id = f"sync_{shortcode}"
        permalink = f"https://www.instagram.com/p/{shortcode}/"
        
        # Check if already synced or exists in curated posts
        if post_id in synced_ids:
            continue
        if shortcode and shortcode in curated_shortcodes:
            print(f"Skipping post {post_id} (shortcode {shortcode}) as it is already in curated posts.")
            continue
            
        # Extract image URL and caption
        img_tag = item.find('img')
        if not img_tag:
            continue
            
        img_url = img_tag.get('src') or img_tag.get('data-src')
        caption = img_tag.get('alt', '').strip()
        
        if not img_url:
            print(f"No image url found for {post_id}. Skipping.")
            continue
            
        print(f"Processing new post ID: {post_id} ({permalink})")
        
        # Download image
        try:
            img_res = requests.get(img_url, headers=headers, timeout=15)
            if img_res.status_code != 200:
                print(f"Failed to download image from {img_url}. Status code: {img_res.status_code}")
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
            "timestamp": "2026-06-17T19:00:00+0900"
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

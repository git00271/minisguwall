import requests
from bs4 import BeautifulSoup
import re
import os

def download():
    url = 'https://instanavigation.net/'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    print("Fetching home page...")
    r = requests.get(url, headers=headers, timeout=10)
    if r.status_code != 200:
        print("Failed to fetch home page:", r.status_code)
        return
        
    soup = BeautifulSoup(r.text, 'html.parser')
    
    # SvelteKit scripts are loaded dynamically, but let's check for any script tags or inline imports
    script_content = ""
    for script in soup.find_all('script'):
        if script.string:
            script_content += script.string + "\n"
            
    # Look for imports like import("./_app/immutable/entry/...")
    imports = re.findall(r'import\s*\(\s*["\']([^"\']+)["\']\s*\)', r.text)
    # Also look for regular script tags with src
    srcs = [s.get('src') for s in soup.find_all('script') if s.get('src')]
    
    print("Found imports:", imports)
    print("Found srcs:", srcs)
    
    os.makedirs('scratch/downloaded_js', exist_ok=True)
    
    for relative_path in imports + srcs:
        if not relative_path.endswith('.js'):
            continue
        # Clean path
        path = relative_path.lstrip('.')
        js_url = 'https://instanavigation.net' + path
        print("Downloading:", js_url)
        js_res = requests.get(js_url, headers=headers, timeout=10)
        if js_res.status_code == 200:
            filename = os.path.basename(path)
            with open(os.path.join('scratch/downloaded_js', filename), 'w', encoding='utf-8') as f:
                f.write(js_res.text)
            print("  -> Saved as", filename, f"({len(js_res.text)} bytes)")
        else:
            print("  -> Failed:", js_res.status_code)

if __name__ == "__main__":
    download()

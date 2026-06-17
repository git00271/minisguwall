import os
import sys
from playwright.sync_api import sync_playwright

def run_verification():
    # Setup directories - use relative paths
    base_dir = "verification"
    video_dir = os.path.join(base_dir, "videos")
    screenshot_dir = os.path.join(base_dir, "screenshots")

    os.makedirs(video_dir, exist_ok=True)
    os.makedirs(screenshot_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir=video_dir
        )
        page = context.new_page()

        errors = []
        page.on("console", lambda msg: errors.append(f"Console error: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(f"Uncaught exception: {exc.message}"))

        failed_requests = []
        # Filter out common benign "aborted" requests like media or preloads
        def handle_request_failed(request):
            url = request.url
            failure = request.failure
            # net::ERR_ABORTED is common for audio/video that doesn't finish downloading before page close/nav
            if failure == "net::ERR_ABORTED" and (".mp3" in url or ".mp4" in url):
                return
            failed_requests.append(f"Request failed: {url} ({failure})")

        page.on("requestfailed", handle_request_failed)

        print("--- Navigating to site ---")
        page.goto("http://localhost:8000")
        page.wait_for_timeout(2000)
        page.screenshot(path=os.path.join(screenshot_dir, "01_initial_load.png"))

        # 1. Test Language Selector
        print("--- Testing Language Selector ---")
        languages = {
            "ko": "Home",
            "en": "Home",
            "ja": "ホーム",
            "ru": "Главная",
            "ar": "الرئيسية",
            "zh": "首页"
        }

        for lang, expected_home_text in languages.items():
            print(f"Switching to: {lang}")
            page.select_option("#lang-select", lang)
            page.wait_for_timeout(1000)
            home_link = page.locator('[data-i18n="nav_home"]')
            actual_text = home_link.inner_text()
            print(f"  Expected: {expected_home_text}, Actual: {actual_text}")
            if expected_home_text not in actual_text:
                errors.append(f"Language switch failed for {lang}: expected '{expected_home_text}', got '{actual_text}'")
            page.screenshot(path=os.path.join(screenshot_dir, f"02_lang_{lang}.png"))

        # 2. Test Interactive Ear Map
        print("--- Testing Ear Map ---")
        page.select_option("#lang-select", "ko")
        page.wait_for_timeout(500)

        lobe_point = page.locator('.piercing-point[data-piercing="lobe"]')
        lobe_point.click(force=True)
        page.wait_for_timeout(1000)

        info_kr = page.locator('.ear-info-kr')
        print(f"  Ear Info (KR) after clicking Lobe: {info_kr.inner_text()}")
        if "귓볼" not in info_kr.inner_text():
            errors.append(f"Ear map click failed: expected '귓볼', got '{info_kr.inner_text()}'")
        page.screenshot(path=os.path.join(screenshot_dir, "03_ear_map_lobe.png"))

        # 3. Test Gallery Filters
        print("--- Testing Gallery Filters ---")
        body_filter = page.locator('.filter-btn[data-filter="body"]')
        body_filter.click()
        page.wait_for_timeout(1000)

        gallery_items = page.locator('#gallery-grid .gallery-item')
        count = gallery_items.count()
        print(f"  Body filter item count: {count}")
        if count == 0:
            errors.append("Gallery filter 'body' returned 0 items.")

        if count > 0:
            first_item_cat = gallery_items.first.get_attribute("data-category")
            if first_item_cat != "body":
                errors.append(f"Gallery filter failed: first item category is '{first_item_cat}', expected 'body'")
        page.screenshot(path=os.path.join(screenshot_dir, "04_gallery_filter_body.png"))

        # 4. Test Image Modal
        print("--- Testing Modal ---")
        if count > 0:
            gallery_items.first.click()
            page.wait_for_timeout(1000)

            modal_overlay = page.locator('#modal-overlay')
            is_visible = modal_overlay.is_visible()
            print(f"  Modal visible: {is_visible}")
            if not is_visible:
                errors.append("Modal did not open after clicking gallery item.")

            page.screenshot(path=os.path.join(screenshot_dir, "05_modal_open.png"))

            close_btn = page.locator('.modal-close-btn')
            close_btn.click()
            page.wait_for_timeout(1000)
            if modal_overlay.is_visible():
                errors.append("Modal did not close after clicking close button.")

        # 5. Test BGM Toggle
        print("--- Testing BGM Toggle ---")
        bgm_btn = page.locator('#bgm-toggle-btn')
        bgm_btn.click()
        page.wait_for_timeout(2000) # Give it a bit more time for audio load start

        has_playing = "playing" in (bgm_btn.get_attribute("class") or "")
        print(f"  BGM playing class: {has_playing}")
        if not has_playing:
            # Try once more
            bgm_btn.click()
            page.wait_for_timeout(1000)
            has_playing = "playing" in (bgm_btn.get_attribute("class") or "")
            if not has_playing:
                errors.append("BGM toggle did not add 'playing' class.")

        page.screenshot(path=os.path.join(screenshot_dir, "06_bgm_toggle.png"))

        print("\n--- Summary ---")
        if not errors and not failed_requests:
            print("All tests passed successfully!")
            exit_code = 0
        else:
            print("Tests finished with errors:")
            for err in errors:
                print(f"  [ERROR] {err}")
            for req in failed_requests:
                print(f"  [FAIL] {req}")
            exit_code = 1

        context.close()
        browser.close()
        sys.exit(exit_code)

if __name__ == "__main__":
    run_verification()

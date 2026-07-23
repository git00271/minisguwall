import os
from PIL import Image

images_to_compress = [
    "images/post_1.jpg", "images/post_2.jpg", "images/post_3.jpg", "images/post_4.jpg",
    "images/post_5.jpg", "images/post_6.jpg", "images/post_7.jpg", "images/post_8.jpg",
    "images/post_9.jpg", "images/post_10.jpg", "images/post_11.jpg", "images/post_12.jpg",
    "images/post_13.jpg", "images/post_14.jpg", "images/post_15.jpg", "images/post_16.jpg",
    "images/post_17.jpg", "images/post_18.jpg", "images/post_20.jpg", "images/post_21.jpg",
    "images/post_24.jpg", "images/post_25.jpg", "images/post_26.jpg", "images/post_27.jpg",
    "images/post_29.jpg", "images/post_30.jpg", "images/post_31.jpg", "images/post_32.jpg",
    "images/post_33.jpg", "images/post_34.jpg", "images/post_35.jpg", "images/post_36.jpg",
    "images/post_38.jpg", "images/post_39.jpg", "images/post_40.jpg",
    "images/body_new_3.jpg", "images/body_new_4.jpg", "images/body_new_6.jpg", "images/body_new_7.jpg",
    "images/map.png"
]

total_original_size = 0
total_webp_size = 0

print("Starting WebP conversion and compression...")
print("-" * 50)

for img_path in images_to_compress:
    if not os.path.exists(img_path):
        print(f"Warning: File not found {img_path}")
        continue
        
    orig_size = os.path.getsize(img_path)
    total_original_size += orig_size
    
    # Define output path
    base, _ = os.path.splitext(img_path)
    webp_path = f"{base}.webp"
    
    try:
        with Image.open(img_path) as img:
            # Convert to RGB (required for JPG/PNG to WebP)
            rgb_img = img.convert("RGB")
            
            # Compress and save
            # quality=75 is the recommended standard for WebP which offers a great balance
            rgb_img.save(webp_path, "WEBP", quality=75)
            
        webp_size = os.path.getsize(webp_path)
        total_webp_size += webp_size
        
        reduction = (orig_size - webp_size) / orig_size * 100
        print(f"Converted: {img_path} ({orig_size/1024:.1f} KB) -> {webp_path} ({webp_size/1024:.1f} KB) | Reduction: {reduction:.1f}%")
    except Exception as e:
        print(f"Error converting {img_path}: {e}")

print("-" * 50)
savings = (total_original_size - total_webp_size) / (1024 * 1024)
percentage = (total_original_size - total_webp_size) / total_original_size * 100
print(f"Original size: {total_original_size / (1024*1024):.2f} MB")
print(f"WebP size: {total_webp_size / (1024*1024):.2f} MB")
print(f"Total size saved: {savings:.2f} MB ({percentage:.1f}% reduction)")

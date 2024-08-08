from PIL import Image, ImageSequence
import numpy as np
from tqdm import tqdm
import colorsys

def generate_color_palette(num_colors):
    colors = []
    for i in range(num_colors):
        hue = i / num_colors
        rgb = colorsys.hsv_to_rgb(hue, 1.0, 1.0)
        colors.append(tuple(int(x * 255) for x in rgb))
    return colors

def atkinson_dither(image, colors, frame_number, has_alpha=False):
    width, height = image.size
    if has_alpha:
        rgba = np.array(image.convert('RGBA'))
        pixels = rgba[:, :, :3]  # Use all RGB channels
        alpha = rgba[:, :, 3]
    else:
        pixels = np.array(image.convert('RGB'))
        alpha = None
    
    color_array = np.array(colors)
    quant_errors = np.zeros_like(pixels, dtype=np.float32)
    
    for y in tqdm(range(height), desc=f'Dithering frame {frame_number}', leave=False):
        for x in range(width):
            old_pixel = pixels[y, x] + quant_errors[y, x]
            closest_color_index = np.argmin(np.sum((color_array - old_pixel) ** 2, axis=1))
            new_pixel = color_array[closest_color_index]
            pixels[y, x] = new_pixel
            quant_error = old_pixel - new_pixel
            
            if x + 1 < width:
                quant_errors[y, x + 1] += quant_error * 1 / 8
            if x + 2 < width:
                quant_errors[y, x + 2] += quant_error * 1 / 8
            if y + 1 < height:
                if x - 1 >= 0:
                    quant_errors[y + 1, x - 1] += quant_error * 1 / 8
                quant_errors[y + 1, x] += quant_error * 1 / 8
                if x + 1 < width:
                    quant_errors[y + 1, x + 1] += quant_error * 1 / 8
            if y + 2 < height:
                quant_errors[y + 2, x] += quant_error * 1 / 8
    
    dithered_image = Image.fromarray(pixels.astype(np.uint8))
    if has_alpha:
        dithered_image.putalpha(Image.fromarray(alpha))
    return dithered_image

def process_image(image_path, output_path, num_colors=256):
    colors = generate_color_palette(num_colors)
    
    image = Image.open(image_path)
    has_alpha = image.mode in ('RGBA', 'LA')
    
    if image.format == 'GIF':
        frames = []
        total_frames = sum(1 for _ in ImageSequence.Iterator(image))
        
        for frame_number, frame in enumerate(tqdm(ImageSequence.Iterator(image), desc='Processing GIF frames', total=total_frames)):
            frame = frame.convert('RGBA' if has_alpha else 'RGB')
            dithered_frame = atkinson_dither(frame, colors, frame_number, has_alpha=has_alpha)
            frames.append(dithered_frame)
        
        frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=image.info.get('duration', 100))
    else:
        dithered_image = atkinson_dither(image.convert('RGBA' if has_alpha else 'RGB'), colors, frame_number=0, has_alpha=has_alpha)
        dithered_image.save(output_path)

if __name__ == "__main__":
    input_path = 'Cadmanship.png'  # Change to your input file
    output_path = 'dither_Cadmanship_v9_256.png'  # Change to your desired output file
    process_image(input_path, output_path, num_colors=256)
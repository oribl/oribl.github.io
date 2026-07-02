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
        rgba = np.array(image)
        pixels = rgba[:, :, :3]  # Use RGB channels
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
    
    dithered_image = Image.fromarray(pixels.astype(np.uint8), mode='RGB')
    if has_alpha:
        dithered_image.putalpha(Image.fromarray(alpha, mode='L'))
    return dithered_image

def process_image(image_path, output_path, num_colors=128):
    colors = generate_color_palette(num_colors)
    
    image = Image.open(image_path)
    has_alpha = 'A' in image.mode
    
    if image.format == 'GIF':
        frames = []
        total_frames = sum(1 for _ in ImageSequence.Iterator(image))
        
        for frame_number, frame in enumerate(tqdm(ImageSequence.Iterator(image), desc='Processing GIF frames', total=total_frames)):
            if has_alpha:
                frame = frame.convert('RGBA')
            else:
                frame = frame.convert('RGB')
            dithered_frame = atkinson_dither(frame, colors, frame_number, has_alpha=has_alpha)
            frames.append(dithered_frame)
        
        frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=image.info.get('duration', 100), disposal=2)
    else:
        if has_alpha:
            image = image.convert('RGBA')
        else:
            image = image.convert('RGB')
        dithered_image = atkinson_dither(image, colors, frame_number=0, has_alpha=has_alpha)
        dithered_image.save(output_path)

if __name__ == "__main__":
    input_path = 'dither_lungs.gif'  # Change to your input file
    output_path = 'dither_lungs_v10.gif'  # Change to your desired output file
    process_image(input_path, output_path, num_colors=128)
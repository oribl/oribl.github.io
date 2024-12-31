from PIL import Image, ImageSequence
import numpy as np
from tqdm import tqdm

def atkinson_dither(image, colors, frame_number):
    width, height = image.size
    pixels = np.array(image.convert('L'))  # Convert image to grayscale

    for y in tqdm(range(height), desc=f'Dithering frame {frame_number}', leave=False):
        for x in range(width):
            old_pixel = pixels[y, x]
            new_pixel = min(colors, key=lambda c: abs(c - old_pixel))
            pixels[y, x] = new_pixel
            quant_error = old_pixel - new_pixel

            if x + 1 < width:
                pixels[y, x + 1] = np.clip(pixels[y, x + 1] + quant_error * 1 / 8, 0, 255)
            if x + 2 < width:
                pixels[y, x + 2] = np.clip(pixels[y, x + 2] + quant_error * 1 / 8, 0, 255)
            if y + 1 < height:
                if x - 1 >= 0:
                    pixels[y + 1, x - 1] = np.clip(pixels[y + 1, x - 1] + quant_error * 1 / 8, 0, 255)
                pixels[y + 1, x] = np.clip(pixels[y + 1, x] + quant_error * 1 / 8, 0, 255)
                if x + 1 < width:
                    pixels[y + 1, x + 1] = np.clip(pixels[y + 1, x + 1] + quant_error * 1 / 8, 0, 255)
            if y + 2 < height:
                pixels[y + 2, x] = np.clip(pixels[y + 2, x] + quant_error * 1 / 8, 0, 255)
    
    return Image.fromarray(pixels)

def convert_to_two_colors(image, colors):
    color1, color2 = [Image.new('RGB', image.size, color) for color in colors]
    mask = image.point(lambda p: p > 127 and 255)
    return Image.composite(color2, color1, mask)

def process_image(image_path, output_path):
    colors = [255, 0]  # Using grayscale for error diffusion
    color_map = ['#303001','#FFFEDB']

    image = Image.open(image_path)

    if image.format == 'GIF':
        frames = []
        total_frames = sum(1 for _ in ImageSequence.Iterator(image))
        
        for frame_number, frame in enumerate(tqdm(ImageSequence.Iterator(image), desc='Processing GIF frames', total=total_frames)):
            dithered_frame = atkinson_dither(frame, colors, frame_number)
            dithered_frame = convert_to_two_colors(dithered_frame, color_map)
            frames.append(dithered_frame)

        frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=image.info['duration'])
    else:
        dithered_image = atkinson_dither(image, colors, frame_number=0)
        dithered_image = convert_to_two_colors(dithered_image, color_map)
        dithered_image.save(output_path)

if __name__ == "__main__":
    input_path = 'Cadmanship.png'  # Change to your input file
    output_path = 'Cadmanship_dither_pv1.png'  # Change to your desired output file
    process_image(input_path, output_path)

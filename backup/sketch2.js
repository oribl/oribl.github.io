let imgs = [];
let pixelation_level = 10;

function preload() {
  imgs.push(loadImage("IMG_0076.jpg"));
  imgs.push(loadImage("Gizmo_orange.png"));
  imgs.push(loadImage("0001_3.gif"));
}

function setup() {
  createCanvas(width, height);
  pixelDensity(1);

  // Assuming you want one image per cell in a grid:
  let numCells = imgs.length;
  let rows = Math.sqrt(numCells); // Calculate rows based on number of images
  let cellWidth = width / rows; // Calculate cell width based on canvas size and rows
  let cellHeight = height / Math.ceil(numCells / rows); // Calculate cell height

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < Math.ceil(numCells / rows); x++) {
      let imgIndex = y * Math.ceil(numCells / rows) + x; // Calculate image index based on grid position
      let img = imgs[imgIndex];
      let pixelatedImg = pixelateImage(img, pixelation_level); // Apply pixelation with variable level
      image(pixelatedImg, x * cellWidth, y * cellHeight, cellWidth, cellHeight); // Draw image in the grid cell
    }
  }
}

function pixelateImage(img, level) {
  // Implement pixelation algorithm here, considering variable level
  // ...
  return pixelatedImage; // Return the pixelated image
}

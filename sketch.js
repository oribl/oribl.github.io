// Define a p5.js sketch
function setup() {
    // Select all images with the class "grid-item"
    let images = document.querySelectorAll('.grid-item img');
    
    // Add event listeners to each image
    images.forEach(img => {
      img.addEventListener('mouseover', () => {
        // Apply blur effect when mouse hovers over the image
        //img.style.filter = 'blur(2px) invert(100%)';
        img.style.filter = 'blur(10px)';
      });
      
      img.addEventListener('mouseleave', () => {
        // Apply invert effect when mouse leaves the image
        
        img.style.filter = 'blur(2px)';
      });
    });
  }
  
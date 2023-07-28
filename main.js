// Select the small and big cursor elements
const cursorSmall = document.querySelector('.small');
const cursorBig = document.querySelector('.big');

// Function to update the position of the custom cursors based on mouse movement
const positionElement = (e) => {
  // Get the Y and X coordinates of the mouse cursor
  const mouseY = e.clientY;
  const mouseX = e.clientX;
   
  // Move the small cursor to the current mouse position
  cursorSmall.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  
  // Move the big cursor to the current mouse position
  cursorBig.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
}

// Add an event listener to detect mouse movement on the window
window.addEventListener('mousemove', positionElement);

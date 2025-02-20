const cursorSmall = document.querySelector('.small');
const cursorSize = 60; // Adjust this value based on your cursor size - twice the size will make the cursor point in be in the middle of the circle
//document.body.style.overflow = 'hidden';

const positionElement = (e) => {
  const mouseY = e.clientY + window.scrollY;
  const mouseX = e.clientX + window.scrollX;

  cursorSmall.style.transform = `translate3d(${mouseX - cursorSize / 2}px, ${mouseY - cursorSize / 2}px, 0)`;

  if (e.target.tagName === 'IMG') {
    cursorSmall.style.backgroundColor = 'rgba(255, 162, 0, 0.489)';
  } else {
    cursorSmall.style.backgroundColor = 'rgba(0, 0, 0, 0.489)';
  }
};

window.addEventListener('mousemove', positionElement);

// Get the button
let scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Show the button when scrolling down to 5% from the bottom
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolledPercentage = (window.scrollY / scrollableHeight) * 100;

  if (scrolledPercentage >= 90) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
}

// Scroll to the top when the button is clicked
scrollToTopBtn.onclick = function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

// Get all the clickable images
const clickableImages = document.querySelectorAll('.clickable-image');

// Add event listener to each image
clickableImages.forEach(img => {
  img.addEventListener('click', () => {
    // Toggle the 'enlarged' class on the clicked image
    img.classList.toggle('enlarged');
  });
});

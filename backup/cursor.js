const cursorSmall = document.querySelector('.small');
const cursorSize = 60; // Adjust this value based on your cursor size - twice the size will make the cursor point in be in the middle of the circle

const positionElement = (e) => {
  const mouseY = e.clientY + window.scrollY;
  const mouseX = e.clientX + window.scrollX;

  cursorSmall.style.transform = `translate3d(${mouseX - cursorSize / 2}px, ${mouseY - cursorSize / 2}px, 0)`;

  if (e.target.tagName === 'IMG') {
    cursorSmall.style.backgroundColor = 'rgba(255, 162, 0, 0.489)';
  } else {
    cursorSmall.style.backgroundColor = 'rgba(0, 0, 0, 0.489)';
  }
}

window.addEventListener('mousemove', positionElement);

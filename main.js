document.addEventListener("DOMContentLoaded", () => {
    const mouseCircle = document.getElementById("mouseCircle");
  
    document.addEventListener("mousemove", (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
  
      mouseCircle.style.left = mouseX + "px";
      mouseCircle.style.top = mouseY + "px";
    });
  });
  
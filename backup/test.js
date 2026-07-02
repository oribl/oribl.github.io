document.addEventListener("DOMContentLoaded", function () {
    const hoverableElements = document.querySelectorAll('.hoverable');
    const imageOverlay = document.querySelector('.image-overlay');
    let overlayImg = null; // Variable to store the current overlay image element

    hoverableElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            const imageUrl = element.getAttribute('data-image-url');
            element.src = imageUrl;

            // Create a new image element for the overlay if it doesn't exist
            if (!overlayImg) {
                overlayImg = new Image();
                imageOverlay.appendChild(overlayImg);
            }
            overlayImg.src = imageUrl;
            overlayImg.onload = function() {
                imageOverlay.style.display = 'flex';
            };
        });

        // Hide the image overlay on mouse leave
        element.addEventListener('mouseleave', function () {
            imageOverlay.style.display = 'none';
        });
    });

    // Also hide the overlay if the user clicks outside the image
    imageOverlay.addEventListener('click', function () {
        imageOverlay.style.display = 'none';
    });
});

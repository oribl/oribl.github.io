document.addEventListener("DOMContentLoaded", function () {
    const hoverableElements = document.querySelectorAll('.hoverable');
    const imageOverlay = document.querySelector('.image-overlay');

    hoverableElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            const imageUrl = element.getAttribute('data-imageUrl');

            // Create a new image element
            const img = new Image();
            img.src = imageUrl;
            img.onload = function() {
                // Check if the device is in portrait mode
                const isPortrait = window.innerHeight > window.innerWidth;

                // Resize the image if it's in portrait mode
                if (isPortrait) {
                    const aspectRatio = img.width / img.height;
                    let newWidth, newHeight;

                    // Calculate new dimensions while keeping the aspect ratio
                    if (aspectRatio >= 1) {
                        newWidth = 1;
                        newHeight = newWidth / aspectRatio;
                    } else {
                        newHeight = 1;
                        newWidth = newHeight * aspectRatio;
                    }

                    // Set the new dimensions
                    img.width = newWidth;
                    img.height = newHeight;
                } else {
                    // Otherwise, set a maximum size of 700x700 pixels
                    const maxImageWidth = 700;
                    const maxImageHeight = 700;

                    // Check if image width or height exceeds the maximum limits
                    if (img.width > maxImageWidth || img.height > maxImageHeight) {
                        const aspectRatio = img.width / img.height;

                        // If the width is larger than the height
                        if (aspectRatio >= 1) {
                            img.width = maxImageWidth;
                            img.height = maxImageWidth / aspectRatio;
                        } else { // If the height is larger than the width
                            img.height = maxImageHeight;
                            img.width = maxImageHeight * aspectRatio;
                        }
                    }
                }

                // Clear the image overlay content and append the resized image
                imageOverlay.innerHTML = '';
                imageOverlay.appendChild(img);
                imageOverlay.style.display = 'flex';
            };
        });

        // Hide the image overlay on mouse leave
        element.addEventListener('mouseleave', function () {
            imageOverlay.innerHTML = '';
            imageOverlay.style.display = 'none';
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll("img");

    images.forEach(function(img) {
        img.addEventListener("load", function() {
            // Hide loader when image is loaded
            img.parentElement.classList.remove("loading");
        });
        img.addEventListener("error", function() {
            // Handle error if image fails to load
            console.error("Error loading image:", img.src);
        });
    });
});

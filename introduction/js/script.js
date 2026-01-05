//try adding java for effects (Inspired from the internet)

// Get elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close-btn');

// Select all gallery images
const galleryImages = document.querySelectorAll('.gallery-card img');

// Add click event to each image
galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
        captionText.innerHTML = img.alt;
    });
});

// Close when clicking the X
closeBtn.addEventListener('click', () => {
    lightbox.style.display = "none";
});

// Close when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.style.display = "none";
    }
});
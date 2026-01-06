//try adding java for effects (Inspired from the internet)

// --- LIGHTBOX ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close-btn');
const galleryImages = document.querySelectorAll('.gallery-card img');

galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
        captionText.innerHTML = img.alt;
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.style.display = "none";
});

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.style.display = "none";
    }
});


// --- DARK MODE TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if(body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('bi-moon');
        themeIcon.classList.add('bi-sun');
    } else {
        themeIcon.classList.remove('bi-sun');
        themeIcon.classList.add('bi-moon');
    }
});


// --- RESUME TOGGLE ---
const resumeBtn = document.getElementById('resumeToggle');
const resumeContent = document.getElementById('resumeContent');

resumeBtn.addEventListener('click', () => {
    resumeContent.classList.toggle('active');
    
    // Optional: Change button text based on state
    if(resumeContent.classList.contains('active')) {
        resumeBtn.innerHTML = '<i class="bi bi-chevron-up"></i> CLOSE PROFILE';
    } else {
        resumeBtn.innerHTML = '<i class="bi bi-file-earmark-person"></i> KNOW MORE ABOUT ME (Click to Open)';
    }
});
// --- PRELOADER LOGIC ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
        }, 800);
    }, 1500); // 1.5s delay to show the welcome message
});

// --- LIGHTBOX & THEME TOGGLE ---
// (Keep your existing Dark Mode and Resume Toggle logic here...)
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    themeIcon.classList.toggle('bi-moon');
    themeIcon.classList.toggle('bi-sun');
});

const resumeBtn = document.getElementById('resumeToggle');
const resumeContent = document.getElementById('resumeContent');

resumeBtn.addEventListener('click', () => {
    resumeContent.classList.toggle('active');
    resumeBtn.innerHTML = resumeContent.classList.contains('active') ? 
        '<i class="bi bi-chevron-up"></i> CLOSE PROFILE' : 
        '<i class="bi bi-file-earmark-person"></i> KNOW MORE ABOUT ME (Click to Open)';
});
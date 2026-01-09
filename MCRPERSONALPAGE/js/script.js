// --- SOUND EFFECTS ---
const clickSound = document.getElementById('sfx-click');
const popSound = document.getElementById('sfx-pop');

// Function to play click sound safely
function playClickSound() {
    if(clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log("Audio play blocked"));
    }
}

// Attach sound to all buttons with class 'sfx-trigger'
document.querySelectorAll('.sfx-trigger, button, a').forEach(el => {
    el.addEventListener('mouseenter', () => {
        // Optional: Hover sound? 
    });
    el.addEventListener('click', playClickSound);
});

// --- ENTER SCREEN & FIREWORKS ---
const enterBtn = document.getElementById('enter-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function createFirework(x, y) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            alpha: 1,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
}

function animateFireworks() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();

        if (p.alpha <= 0) particles.splice(index, 1);
    });

    if (particles.length > 0 || welcomeScreen.style.opacity !== '0') {
        requestAnimationFrame(animateFireworks);
    }
}

// ENTER BUTTON CLICK
enterBtn.addEventListener('click', () => {
    // 1. Play Sounds
    playClickSound();
    if(popSound) popSound.play();

    // 2. Create Fireworks
    createFirework(window.innerWidth / 2, window.innerHeight / 2);
    createFirework(window.innerWidth / 3, window.innerHeight / 3);
    createFirework(window.innerWidth * 0.7, window.innerHeight * 0.6);
    animateFireworks();

    // 3. Unlock Screen
    setTimeout(() => {
        document.body.classList.remove('locked');
        document.body.classList.add('active');
    }, 1200); // Fade out after 1.2s
});

// Resize Canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// --- LIGHTBOX & TOGGLES (Standard) ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close-btn');
const galleryImages = document.querySelectorAll('.gallery-container .gallery-card img'); // Only clickable static gallery

galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
        captionText.innerHTML = img.alt;
    });
});

if(closeBtn) closeBtn.onclick = () => lightbox.style.display = "none";
if(lightbox) lightbox.onclick = (e) => { if(e.target !== lightboxImg) lightbox.style.display = "none"; };

const themeToggle = document.getElementById('theme-toggle');
if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        if(document.body.classList.contains('dark-mode')) {
            icon.classList.replace('bi-moon', 'bi-sun');
        } else {
            icon.classList.replace('bi-sun', 'bi-moon');
        }
    });
}

const resumeBtn = document.getElementById('resumeToggle');
const resumeContent = document.getElementById('resumeContent');
if(resumeBtn) {
    resumeBtn.addEventListener('click', () => {
        resumeContent.classList.toggle('active');
        // Icon change logic can go here
    });
}
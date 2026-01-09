// --- SOUND EFFECTS ---
const clickSound = document.getElementById('sfx-click');
const popSound = document.getElementById('sfx-pop');

function playClickSound() {
    if(clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log("Audio play blocked"));
    }
}

// Attach sound to interactive elements
document.querySelectorAll('.sfx-trigger, button, a, .project-card, .search-pill, .snap-item').forEach(el => {
    el.addEventListener('click', playClickSound);
});

// --- CUSTOM CURSOR LOGIC ---
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Click Burst Effect
window.addEventListener('mousedown', () => {
    cursorOutline.classList.add('click-active');
});

window.addEventListener('mouseup', () => {
    cursorOutline.classList.remove('click-active');
});

// Hover States
const interactiveElements = document.querySelectorAll('a, button, .project-card, .snap-item, .clickable-section');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// --- WEAKNESS EASTER EGG ---
const weaknessBtn = document.getElementById('weakness-btn');
let weaknessStep = 0;

weaknessBtn.addEventListener('click', () => {
    if (weaknessStep === 0) {
        weaknessBtn.innerText = "👉 YOU";
        weaknessStep = 1;
    } else if (weaknessStep === 1) {
        weaknessBtn.innerText = "✖️ MATH";
        weaknessBtn.classList.add('btn-fill'); 
        weaknessBtn.classList.remove('btn-outline');
        weaknessStep = 2;
    } else {
        weaknessBtn.innerText = "View Weakness ⚠️";
        weaknessBtn.classList.remove('btn-fill');
        weaknessBtn.classList.add('btn-outline');
        weaknessStep = 0;
    }
});

// --- LIGHTBOX LOGIC FOR QUICK SNAPS ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close-btn');
const snapImages = document.querySelectorAll('.snap-item img'); 

snapImages.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
        captionText.innerHTML = img.alt;
    });
});

if(closeBtn) closeBtn.onclick = () => lightbox.style.display = "none";
if(lightbox) lightbox.onclick = (e) => { if(e.target !== lightboxImg) lightbox.style.display = "none"; };


// --- MODAL LOGIC (References & Contact) ---
const infoModal = document.getElementById('info-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModal = infoModal.querySelector('.close-modal');

closeModal.onclick = () => infoModal.style.display = 'none';
window.onclick = (e) => { if (e.target == infoModal) infoModal.style.display = 'none'; }

// Reference Button
document.getElementById('ref-btn').addEventListener('click', (e) => {
    e.preventDefault();
    infoModal.style.display = 'flex';
    modalTitle.innerText = "References";
    modalBody.innerHTML = `
        <p><strong>LeanTech:</strong> Project Lead - Contact via LinkedIn</p>
        <p><strong>Clark Air Base Youth Club:</strong> Coordinator</p>
        <p><strong>IBM SkillsBuild:</strong> Verified Badges</p>
    `;
});


// --- WELCOME SCREEN ---
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
            x: x, y: y,
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

enterBtn.addEventListener('click', () => {
    playClickSound();
    if(popSound) popSound.play();
    createFirework(window.innerWidth / 2, window.innerHeight / 2);
    createFirework(window.innerWidth / 3, window.innerHeight / 3);
    animateFireworks();
    setTimeout(() => {
        document.body.classList.remove('locked');
        document.body.classList.add('active');
    }, 1200);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// --- TOGGLES ---
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
    });
}
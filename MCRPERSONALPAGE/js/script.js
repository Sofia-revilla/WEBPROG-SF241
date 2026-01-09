// --- SOUND EFFECTS ---
const clickSound = document.getElementById('sfx-click');
const popSound = document.getElementById('sfx-pop');

function playClickSound() {
    if(clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log("Audio play blocked"));
    }
}

document.querySelectorAll('.sfx-trigger, button, a, .project-card, .search-pill').forEach(el => {
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

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card, .photo-card');
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
        weaknessBtn.classList.add('btn-fill'); // Make it red/filled
        weaknessBtn.classList.remove('btn-outline');
        weaknessStep = 2;
    } else {
        // Reset
        weaknessBtn.innerText = "View Weakness ⚠️";
        weaknessBtn.classList.remove('btn-fill');
        weaknessBtn.classList.add('btn-outline');
        weaknessStep = 0;
    }
});

// --- COMING SOON MODAL LOGIC ---
const infoModal = document.getElementById('info-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModal = infoModal.querySelector('.close-modal');

// Close Logic
closeModal.onclick = () => infoModal.style.display = 'none';
window.onclick = (e) => { if (e.target == infoModal) infoModal.style.display = 'none'; }

// Attach to specific sections
const clickableSections = document.querySelectorAll('.clickable-section, .project-card');

clickableSections.forEach(item => {
    item.addEventListener('click', function() {
        infoModal.style.display = 'flex';
        modalTitle.innerText = "Coming Soon";
        modalBody.innerText = "This section is under construction. Stay tuned for jaw-dropping updates!";
        
        // Use logic to detect which section was clicked if you want specific messages
        if(this.dataset.section === "Skills") {
             modalTitle.innerText = "Skills Detail";
             modalBody.innerText = "Detailed breakdown of my tech stack coming soon!";
        }
    });
});

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
    createFirework(window.innerWidth * 0.7, window.innerHeight * 0.6);
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
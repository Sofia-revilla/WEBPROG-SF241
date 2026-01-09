// --- ALBUM DATA (Images per Album) ---
const albums = {
    'pets': ['image/kel.jpg', 'image/pet2.jpg', 'image/tal.jpg', 'image/nat.jpg'],
    'art': ['image/draww.png', 'image/draww.png', 'image/draww.png'], // Add more if you have them
    'family': ['image/family.jpg', 'image/family.jpg'],
    'hobbies': ['image/shs.jpg', 'image/shs.jpg'],
    'memories': ['image/me.png', 'image/shs.jpg']
};

let currentAlbum = [];
let currentImgIndex = 0;

// --- SOUNDS ---
const clickSound = document.getElementById('sfx-click');
const popSound = document.getElementById('sfx-pop');

// --- CURSOR FIREWORKS ---
const clickCanvas = document.getElementById('click-canvas');
const clickCtx = clickCanvas.getContext('2d');
clickCanvas.width = window.innerWidth;
clickCanvas.height = window.innerHeight;
let clickParticles = [];

function createClickFirework(x, y) {
    for (let i = 0; i < 15; i++) {
        clickParticles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`
        });
    }
}

function animateClickFireworks() {
    clickCtx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
    clickParticles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        p.life -= 0.05;
        clickCtx.fillStyle = p.color;
        clickCtx.globalAlpha = p.life;
        clickCtx.beginPath();
        clickCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        clickCtx.fill();
        if(p.life <= 0) clickParticles.splice(i, 1);
    });
    if(clickParticles.length > 0) requestAnimationFrame(animateClickFireworks);
}

window.addEventListener('mousedown', (e) => {
    createClickFirework(e.clientX, e.clientY);
    animateClickFireworks();
    
    // Play sound safely
    if(clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(()=>{});
    }
});

// --- CUSTOM CURSOR MOVEMENT ---
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX; const posY = e.clientY;
    cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
});

// --- POLAROID CLICK LOGIC (Open Album) ---
document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('click', () => {
        const albumKey = card.getAttribute('data-album');
        if(albums[albumKey]) {
            currentAlbum = albums[albumKey];
            currentImgIndex = 0;
            openLightbox();
        }
    });
});

// --- LIGHTBOX NAVIGATION ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('caption');
const counter = document.getElementById('album-counter');

function openLightbox() {
    lightbox.style.display = "flex";
    updateLightboxImage();
}

function updateLightboxImage() {
    lightboxImg.src = currentAlbum[currentImgIndex];
    caption.innerText = `Album View`;
    counter.innerText = `${currentImgIndex + 1} / ${currentAlbum.length}`;
}

document.querySelector('.next-btn').addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent closing lightbox
    currentImgIndex = (currentImgIndex + 1) % currentAlbum.length;
    updateLightboxImage();
});

document.querySelector('.prev-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    currentImgIndex = (currentImgIndex - 1 + currentAlbum.length) % currentAlbum.length;
    updateLightboxImage();
});

document.querySelector('.close-btn').onclick = () => lightbox.style.display = "none";
lightbox.onclick = (e) => { 
    if(e.target === lightbox) lightbox.style.display = "none"; 
};

// --- WELCOME SCREEN (Unlocks Audio) ---
const enterBtn = document.getElementById('enter-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const fireworkCanvas = document.getElementById('fireworks-canvas');
const fwCtx = fireworkCanvas.getContext('2d');
fireworkCanvas.width = window.innerWidth; fireworkCanvas.height = window.innerHeight;
let fwParticles = [];

enterBtn.addEventListener('click', () => {
    // UNLOCK AUDIO ENGINE
    if(popSound) { popSound.volume = 0.5; popSound.play().catch(e => console.log("Audio Error:", e)); }
    
    // Fireworks
    createBigFirework();
    animateBigFireworks();

    setTimeout(() => {
        document.body.classList.remove('locked');
        document.body.classList.add('active');
    }, 1200);
});

function createBigFirework() {
    for(let i=0; i<80; i++) {
        fwParticles.push({
            x: window.innerWidth/2, y: window.innerHeight/2,
            vx: (Math.random()-0.5)*15, vy: (Math.random()-0.5)*15,
            alpha: 1, color: '#fff'
        });
    }
}

function animateBigFireworks() {
    fwCtx.globalCompositeOperation = 'destination-out';
    fwCtx.fillStyle = 'rgba(0,0,0,0.1)';
    fwCtx.fillRect(0,0, fireworkCanvas.width, fireworkCanvas.height);
    fwCtx.globalCompositeOperation = 'lighter';
    
    fwParticles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.01;
        fwCtx.fillStyle = p.color; fwCtx.globalAlpha = p.alpha;
        fwCtx.beginPath(); fwCtx.arc(p.x, p.y, 4, 0, Math.PI*2); fwCtx.fill();
        if(p.alpha<=0) fwParticles.splice(i,1);
    });
    
    if(fwParticles.length > 0) requestAnimationFrame(animateBigFireworks);
}

// --- WEAKNESS BTN ---
const weaknessBtn = document.getElementById('weakness-btn');
let wStep = 0;
weaknessBtn.addEventListener('click', () => {
    if(wStep === 0) { weaknessBtn.innerText = "👉 YOU"; wStep=1; }
    else if(wStep === 1) { weaknessBtn.innerText = "✖️ MATH"; weaknessBtn.classList.add('btn-fill'); weaknessBtn.classList.remove('btn-outline'); wStep=2; }
    else { weaknessBtn.innerText = "View Weakness ⚠️"; weaknessBtn.classList.remove('btn-fill'); weaknessBtn.classList.add('btn-outline'); wStep=0; }
});

// --- TOGGLES ---
document.getElementById('theme-toggle').onclick = () => document.body.classList.toggle('dark-mode');
document.getElementById('resumeToggle').onclick = () => document.getElementById('resumeContent').classList.toggle('active');
// --- SIDE NAV LOGIC ---
const sideNav = document.getElementById('side-nav');
const toggleBtn = document.getElementById('side-nav-toggle');
const closeNav = document.querySelector('.close-nav');

toggleBtn.onclick = () => sideNav.classList.add('active');
closeNav.onclick = () => sideNav.classList.remove('active');

// --- ALBUM DATA ---
const albums = {
    'pets': ['image/kel.jpg', 'image/pet2.jpg', 'image/tal.jpg'],
    'art': ['image/draww.png'],
    'family': ['image/family.jpg'],
    'hobbies': ['image/shs.jpg'],
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
    for (let i = 0; i < 12; i++) {
        clickParticles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
            life: 1, color: `hsl(${Math.random() * 360}, 100%, 60%)`
        });
    }
}

function animateClickFireworks() {
    clickCtx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
    clickParticles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.05;
        clickCtx.fillStyle = p.color; clickCtx.globalAlpha = p.life;
        clickCtx.beginPath(); clickCtx.arc(p.x, p.y, 3, 0, Math.PI * 2); clickCtx.fill();
        if(p.life <= 0) clickParticles.splice(i, 1);
    });
    if(clickParticles.length > 0) requestAnimationFrame(animateClickFireworks);
}

window.addEventListener('mousedown', (e) => {
    createClickFirework(e.clientX, e.clientY);
    animateClickFireworks();
    if(clickSound) { clickSound.currentTime = 0; clickSound.play().catch(()=>{}); }
});

// --- CUSTOM CURSOR ---
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX; const posY = e.clientY;
    cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
});

// --- LIGHTBOX ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('caption');
const counter = document.getElementById('album-counter');

function updateLightboxImage() {
    lightboxImg.src = currentAlbum[currentImgIndex];
    caption.innerText = "Viewing Album";
    counter.innerText = `${currentImgIndex + 1} / ${currentAlbum.length}`;
}

document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('click', () => {
        const albumKey = card.getAttribute('data-album');
        if(albums[albumKey]) {
            currentAlbum = albums[albumKey];
            currentImgIndex = 0;
            lightbox.style.display = "flex";
            updateLightboxImage();
        }
    });
});

document.querySelector('.next-btn').onclick = (e) => {
    e.stopPropagation();
    currentImgIndex = (currentImgIndex + 1) % currentAlbum.length;
    updateLightboxImage();
};
document.querySelector('.prev-btn').onclick = (e) => {
    e.stopPropagation();
    currentImgIndex = (currentImgIndex - 1 + currentAlbum.length) % currentAlbum.length;
    updateLightboxImage();
};
document.querySelector('.close-btn').onclick = () => lightbox.style.display = "none";

// --- WELCOME SCREEN ---
const enterBtn = document.getElementById('enter-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const fireworkCanvas = document.getElementById('fireworks-canvas');
const fwCtx = fireworkCanvas.getContext('2d');
fireworkCanvas.width = window.innerWidth; fireworkCanvas.height = window.innerHeight;
let fwParticles = [];

enterBtn.addEventListener('click', () => {
    if(popSound) { popSound.volume = 0.5; popSound.play().catch(()=>{}); }
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
weaknessBtn.onclick = (e) => {
    e.stopPropagation();
    if(wStep===0) { weaknessBtn.innerText="👉 YOU"; wStep=1; }
    else if(wStep===1) { weaknessBtn.innerText="✖️ MATH"; wStep=2; }
    else { weaknessBtn.innerText="View Weakness ⚠️"; wStep=0; }
};

document.getElementById('theme-toggle').onclick = () => document.body.classList.toggle('dark-mode');
document.getElementById('resumeToggle').onclick = () => document.getElementById('resumeContent').classList.toggle('active');
window.openProject = (t, d) => {
    document.getElementById('modal-title').innerText = t;
    document.getElementById('modal-body').innerText = d;
    document.getElementById('info-modal').style.display = 'flex';
};
document.querySelector('.close-modal').onclick = () => document.getElementById('info-modal').style.display = 'none';
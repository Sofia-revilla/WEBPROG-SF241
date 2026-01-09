// --- AUDIO SYSTEM ---
const clickSound = document.getElementById('sfx-click');
const popSound = document.getElementById('sfx-pop');

function playClick() {
    if(clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    }
}

// Attach Sound to all 'sfx-trigger' elements
document.addEventListener('click', (e) => {
    if(e.target.closest('.sfx-trigger')) {
        playClick();
    }
});

// --- MUSIC PLAYER LOGIC ---
const songs = [
    { title: "Chill Beats", artist: "LoFi", src: "audio/song1.mp3" }, // CHANGE THESE PATHS
    { title: "Cyber Vibe", artist: "Synth", src: "audio/song2.mp3" }
];
let songIndex = 0;
const bgMusic = document.getElementById('bg-music');
const playBtn = document.getElementById('play-pause');
const vinyl = document.getElementById('vinyl');
const titleEl = document.getElementById('song-title');
const artistEl = document.getElementById('song-artist');
let isPlaying = false;

// Initialize Player
if(songs.length > 0) {
    bgMusic.src = songs[0].src;
}

playBtn.addEventListener('click', () => {
    if(isPlaying) {
        bgMusic.pause();
        playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        document.querySelector('.music-player-container').classList.remove('playing');
        isPlaying = false;
    } else {
        bgMusic.play().catch(e => console.log("Add MP3 files to audio/ folder!"));
        playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        document.querySelector('.music-player-container').classList.add('playing');
        isPlaying = true;
    }
});

// Next/Prev Logic
document.getElementById('next-song').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    updateSong();
});
document.getElementById('prev-song').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    updateSong();
});

function updateSong() {
    titleEl.innerText = songs[songIndex].title;
    artistEl.innerText = songs[songIndex].artist;
    bgMusic.src = songs[songIndex].src;
    if(isPlaying) bgMusic.play();
}

// --- GUESTBOOK (Local Storage) ---
const noteInput = document.getElementById('guest-note');
const saveBtn = document.getElementById('save-note-btn');
const notesDisplay = document.getElementById('notes-display');

// Load Notes on Start
const savedNotes = JSON.parse(localStorage.getItem('myGuestbook')) || [];
savedNotes.forEach(note => displayNote(note));

saveBtn.addEventListener('click', () => {
    const text = noteInput.value;
    if(text.trim() !== "") {
        const noteObj = { text: text, date: new Date().toLocaleDateString() };
        savedNotes.push(noteObj);
        localStorage.setItem('myGuestbook', JSON.stringify(savedNotes));
        displayNote(noteObj);
        noteInput.value = ""; // Clear input
    }
});

function displayNote(note) {
    const div = document.createElement('div');
    div.className = 'saved-note';
    div.innerHTML = `<strong>Guest (${note.date}):</strong><br>${note.text}`;
    notesDisplay.prepend(div);
}

// --- CURSOR & FIREWORKS ---
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX; const posY = e.clientY;
    cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
});

// Click Fireworks
const clickCanvas = document.getElementById('click-canvas');
const clickCtx = clickCanvas.getContext('2d');
clickCanvas.width = window.innerWidth; clickCanvas.height = window.innerHeight;
let particles = [];

window.addEventListener('mousedown', (e) => {
    createParticles(e.clientX, e.clientY);
});

function createParticles(x, y) {
    for(let i=0; i<10; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5,
            life: 1, color: `hsl(${Math.random()*360}, 100%, 50%)`
        });
    }
}

function animateParticles() {
    clickCtx.clearRect(0,0,clickCanvas.width, clickCanvas.height);
    particles.forEach((p,i) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.05;
        clickCtx.fillStyle = p.color; clickCtx.globalAlpha = p.life;
        clickCtx.beginPath(); clickCtx.arc(p.x, p.y, 3, 0, Math.PI*2); clickCtx.fill();
        if(p.life<=0) particles.splice(i,1);
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- SIDE NAV ---
const sideNav = document.getElementById('side-nav');
document.getElementById('side-nav-toggle').onclick = () => sideNav.classList.add('active');
document.querySelector('.close-nav').onclick = () => sideNav.classList.remove('active');

// --- RESUME TOGGLE ---
document.getElementById('resumeToggle').onclick = () => document.getElementById('resumeContent').classList.toggle('active');

// --- WELCOME SCREEN ---
document.getElementById('enter-btn').addEventListener('click', () => {
    if(popSound) popSound.play().catch(()=>{});
    setTimeout(() => {
        document.body.classList.remove('locked');
        document.getElementById('welcome-screen').style.opacity = '0';
        document.getElementById('welcome-screen').style.pointerEvents = 'none';
    }, 500);
});

// --- LIGHTBOX LOGIC ---
const albums = {
    'pets': ['image/kel.jpg', 'image/pet2.jpg', 'image/tal.jpg', 'image/nat.jpg'],
    'art': ['image/draww.png', 'image/draww.png'],
    'family': ['image/family.jpg'],
    'hobbies': ['image/shs.jpg'],
    'memories': ['image/me.png']
};
let currentAlbum = [];
let idx = 0;
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');

document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('click', () => {
        const key = card.getAttribute('data-album');
        if(albums[key]) {
            currentAlbum = albums[key];
            idx = 0;
            lbImg.src = currentAlbum[idx];
            lightbox.style.display = 'flex';
        }
    });
});

document.querySelector('.next-btn').onclick = (e) => {
    e.stopPropagation();
    idx = (idx + 1) % currentAlbum.length;
    lbImg.src = currentAlbum[idx];
};
document.querySelector('.prev-btn').onclick = (e) => {
    e.stopPropagation();
    idx = (idx - 1 + currentAlbum.length) % currentAlbum.length;
    lbImg.src = currentAlbum[idx];
};
document.querySelector('.close-btn').onclick = () => lightbox.style.display = 'none';
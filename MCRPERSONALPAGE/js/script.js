// --- AUDIO CONTEXT UNLOCK & SOUNDS ---
const clickSound = document.getElementById('sfx-click');
const popSound = document.getElementById('sfx-pop');

// Modern browsers require user interaction before playing audio
let audioUnlocked = false;

function playSound(audioEl) {
    if (audioEl && audioUnlocked) {
        audioEl.currentTime = 0;
        audioEl.play().catch(e => console.log("Audio skipped:", e));
    }
}

// --- CURSOR LOGIC ---
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Animate Dot
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Animate Outline with slight delay
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Add hover effect to interactive elements
const interactiveEls = document.querySelectorAll('a, button, .sfx-trigger, .polaroid');
interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    
    el.addEventListener('mousedown', () => {
        playSound(clickSound); // Play click sound
    });
});

// --- SIDE NAV ---
const sideNav = document.getElementById('side-nav');
const toggleBtn = document.getElementById('side-nav-toggle');
const closeNav = document.querySelector('.close-nav');

toggleBtn.addEventListener('click', () => sideNav.classList.add('active'));
closeNav.addEventListener('click', () => sideNav.classList.remove('active'));

// --- WELCOME SCREEN ENTER ---
const enterBtn = document.getElementById('enter-btn');
const welcomeScreen = document.getElementById('welcome-screen');

enterBtn.addEventListener('click', () => {
    // 1. Unlock Audio Context
    audioUnlocked = true;
    if(popSound) { 
        popSound.volume = 0.5; 
        popSound.play().catch(e => console.log(e)); 
    }

    // 2. Hide Screen
    setTimeout(() => {
        document.body.classList.remove('locked');
        document.body.classList.add('active');
    }, 500);
});

// --- MUSIC PLAYER ---
const musicCard = document.querySelector('.music-player-card');
const playBtn = document.getElementById('music-toggle');
let isPlaying = false;

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if(isPlaying) {
        musicCard.classList.add('playing');
        playBtn.classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');
        // If you had a real mp3, you would do audio.play() here
    } else {
        musicCard.classList.remove('playing');
        playBtn.classList.replace('bi-pause-circle-fill', 'bi-play-circle-fill');
        // audio.pause()
    }
});

// --- GUESTBOOK (LocalStorage) ---
const guestMsg = document.getElementById('guest-msg');
const sendBtn = document.getElementById('guest-send');
const guestList = document.getElementById('guest-list');

// Load saved notes
const savedNotes = JSON.parse(localStorage.getItem('sofia_guestbook')) || [];
savedNotes.forEach(note => displayNote(note));

sendBtn.addEventListener('click', () => {
    const text = guestMsg.value.trim();
    if(text) {
        // Save to array
        savedNotes.unshift(text); // Add to top
        localStorage.setItem('sofia_guestbook', JSON.stringify(savedNotes));
        
        // Display
        displayNote(text);
        guestMsg.value = ""; // Clear input
        playSound(clickSound);
    }
});

function displayNote(text) {
    const div = document.createElement('div');
    div.classList.add('guest-note');
    div.innerText = `“${text}”`;
    guestList.prepend(div);
}

// --- POLAROID & LIGHTBOX ---
// (Keep your existing Polaroid/Lightbox Logic here from previous script.js)
// Just ensure playSound(clickSound) is called inside clicks.
const lightbox = document.getElementById('lightbox');
const closeBtn = document.querySelector('.close-btn');

document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('click', () => {
        // Simple placeholder logic for demo
        const img = card.querySelector('img').src;
        document.getElementById('lightbox-img').src = img;
        lightbox.style.display = 'flex';
    });
});
closeBtn.onclick = () => lightbox.style.display = 'none';

// --- WEAKNESS BUTTON LOGIC ---
const weaknessBtn = document.getElementById('weakness-btn');
let wStep = 0;
weaknessBtn.addEventListener('click', () => {
    if(wStep === 0) { weaknessBtn.innerText = "👉 YOU"; wStep=1; }
    else if(wStep === 1) { weaknessBtn.innerText = "✖️ MATH"; weaknessBtn.classList.add('btn-fill'); weaknessBtn.classList.remove('btn-outline'); wStep=2; }
    else { weaknessBtn.innerText = "View Weakness ⚠️"; weaknessBtn.classList.remove('btn-fill'); weaknessBtn.classList.add('btn-outline'); wStep=0; }
});
(function() {
    // --- CONFIGURATION ---
    // Make sure these files exist in your 'gallery' folder!
    const images = [
        { url: 'image/draww.png', title: 'My Life', artist: 'MEMORIES' }, 
        { url: 'gallery/img2.jpg', title: 'Adventure', artist: 'TRAVEL' },
        { url: 'gallery/img3.jpg', title: 'Family', artist: 'LOVE' },
        { url: 'gallery/img4.jpg', title: 'Friends', artist: 'FUN' }
    ];

    // Fallback if images fail (using placeholders if you haven't uploaded yet)
    // You can remove this check once you have your real images.
    const container = document.getElementById('art-gallery-container');
    const titleEl = document.getElementById('art-title');
    const artistEl = document.getElementById('art-artist');

    if (!container) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Initial Size
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // --- TEXTURE LOADER ---
    const loader = new THREE.TextureLoader();
    const textures = images.map(img => {
        // Load image, add error handling to replace with placeholder if missing
        return loader.load(img.url, undefined, undefined, (err) => {
            console.warn(`Could not load ${img.url}. Check folder name!`);
        });
    });

    // --- SHADER (Liquid Distortion) ---
    const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
    const fragmentShader = `
        varying vec2 vUv;
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform float dispFactor;
        void main() {
            vec2 uv = vUv;
            vec2 dist1 = vec2(uv.x + dispFactor * (sin(uv.y * 10.0 + dispFactor) * 0.1), uv.y);
            vec2 dist2 = vec2(uv.x - (1.0 - dispFactor) * (sin(uv.y * 10.0 + dispFactor) * 0.1), uv.y);
            gl_FragColor = mix(texture2D(texture1, dist1), texture2D(texture2, dist2), dispFactor);
        }
    `;

    const material = new THREE.ShaderMaterial({
        uniforms: {
            dispFactor: { value: 0.0 },
            texture1: { value: textures[0] },
            texture2: { value: textures[1] }
        },
        vertexShader,
        fragmentShader,
        transparent: true
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // --- AUTOMATION LOGIC ---
    let currentIdx = 0;
    let isAnimating = false;

    function nextSlide() {
        if (isAnimating) return;
        isAnimating = true;

        const nextIdx = (currentIdx + 1) % images.length;
        material.uniforms.texture2.value = textures[nextIdx];

        gsap.to(material.uniforms.dispFactor, {
            value: 1,
            duration: 1.5,
            ease: "expo.inOut",
            onComplete: () => {
                material.uniforms.texture1.value = textures[nextIdx];
                material.uniforms.dispFactor.value = 0;
                currentIdx = nextIdx;
                isAnimating = false;
            }
        });

        if(titleEl) titleEl.innerText = images[nextIdx].title;
        if(artistEl) artistEl.innerText = images[nextIdx].artist;
    }

    // Auto-change every 5 seconds
    setInterval(nextSlide, 5000);

    // --- RESPONSIVE RESIZE ---
    window.addEventListener('resize', () => {
        // Essential for mobile: Update renderer size when window changes
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        renderer.setSize(width, height);
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    
    // Set initial text
    if(titleEl) titleEl.innerText = images[0].title;
    if(artistEl) artistEl.innerText = images[0].artist;
})();
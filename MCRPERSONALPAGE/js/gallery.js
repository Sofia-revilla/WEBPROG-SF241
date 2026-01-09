(function() {
    // Shaders remain the same as previous steps...
    const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
    const fragmentShader = `varying vec2 vUv; uniform sampler2D texture1; uniform sampler2D texture2; uniform float dispFactor; void main() { vec2 uv = vUv; vec2 dist1 = vec2(uv.x + dispFactor * (sin(uv.y * 10.0 + dispFactor) * 0.1), uv.y); vec2 dist2 = vec2(uv.x - (1.0 - dispFactor) * (sin(uv.y * 10.0 + dispFactor) * 0.1), uv.y); gl_FragColor = mix(texture2D(texture1, dist1), texture2D(texture2, dist2), dispFactor); }`;

    const miniImages = [
        { url: 'image/draww.png', title: 'My Digital Drawing' },
        { url: 'image/shs.jpg', title: 'SHS Memories' },
        { url: 'image/kel.jpg', title: 'Twinkel' },
        { url: 'image/tal.jpg', title: 'Talia' }
    ];

    function initEffect(containerId, titleId, images, autoPlay = true) {
        const container = document.getElementById(containerId);
        const titleElement = document.getElementById(titleId);
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        const loader = new THREE.TextureLoader();
        const textures = images.map(img => loader.load(img.url));

        const mat = new THREE.ShaderMaterial({
            uniforms: { dispFactor: { value: 0.0 }, texture1: { value: textures[0] }, texture2: { value: textures[1] } },
            vertexShader, fragmentShader, transparent: true
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
        scene.add(mesh);

        let currentIdx = 0;
        let isAnimating = false;

        function transition(nextIdx) {
            if (isAnimating) return;
            isAnimating = true;
            mat.uniforms.texture2.value = textures[nextIdx];
            gsap.to(mat.uniforms.dispFactor, {
                value: 1, duration: 1.2, ease: "expo.inOut",
                onComplete: () => {
                    mat.uniforms.texture1.value = textures[nextIdx];
                    mat.uniforms.dispFactor.value = 0;
                    currentIdx = nextIdx;
                    isAnimating = false;
                }
            });
            titleElement.innerText = images[nextIdx].title;
        }

        container.addEventListener('click', () => transition((currentIdx + 1) % images.length));

        // Auto-Play Logic
        if (autoPlay) {
            setInterval(() => {
                if (!isAnimating) transition((currentIdx + 1) % images.length);
            }, 5000); // Changes every 5 seconds
        }

        function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); }
        animate();
    }

    // Initialize
    initEffect('wide-art-banner', 'wide-art-title', [
        { url: 'https://images.unsplash.com/photo-1541119638723-c51cbe2262aa?q=80', title: 'The Starry Night' },
        { url: 'https://images.unsplash.com/photo-1543857182-68106299b6b2?q=80', title: 'Cafe Terrace at Night' }
    ]);

    initEffect('mini-art-gallery', 'mini-art-title', miniImages);

    // --- VIEW ALL MODAL LOGIC ---
    const modal = document.getElementById('gallery-modal');
    const viewAllBtn = document.getElementById('view-all-btn');
    const gridContent = document.querySelector('.gallery-grid-content');
    const closeGallery = document.querySelector('.close-gallery');

    viewAllBtn.addEventListener('click', () => {
        gridContent.innerHTML = ''; // Clear existing
        miniImages.forEach(img => {
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.innerHTML = `<img src="${img.url}" alt="${img.title}">`;
            gridContent.appendChild(div);
        });
        modal.style.display = "flex";
    });

    closeGallery.addEventListener('click', () => modal.style.display = "none");
})();
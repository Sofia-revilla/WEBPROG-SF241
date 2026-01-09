(function() {
    // --- 1. LIFE GALLERY IMAGES (Left - Portrait) ---
    const lifeImages = [
        { url: 'image/pet2.jpg', title: 'Happiness', artist: 'MY PETS' },
        { url: 'image/draww.png', title: 'Creativity', artist: 'ARTWORKS' },
        { url: 'image/family.jpg', title: 'Support', artist: 'FAMILY' }
    ];

    // --- 2. SKILLS GALLERY IMAGES (Right - Portrait) ---
    // Use images of your badges/logos here
    const skillImages = [
        { url: 'image/shs.jpg', title: 'Certified', artist: 'IBM SKILLS' },
        { url: 'image/me.png', title: 'Tech Stack', artist: 'PYTHON & JS' },
        { url: 'image/kel.jpg', title: 'Security', artist: 'CYBER LAB' }
    ];

    function initGallery(containerId, titleId, artistId, imageSet) {
        const container = document.getElementById(containerId);
        const titleEl = document.getElementById(titleId);
        const artistEl = document.getElementById(artistId);

        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        const loader = new THREE.TextureLoader();
        const textures = imageSet.map(img => loader.load(img.url));

        const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
        const fragmentShader = `
            varying vec2 vUv; uniform sampler2D texture1; uniform sampler2D texture2; uniform float dispFactor;
            void main() {
                vec2 uv = vUv;
                vec2 dist1 = vec2(uv.x + dispFactor * (sin(uv.y * 10.0 + dispFactor) * 0.1), uv.y);
                vec2 dist2 = vec2(uv.x - (1.0 - dispFactor) * (sin(uv.y * 10.0 + dispFactor) * 0.1), uv.y);
                gl_FragColor = mix(texture2D(texture1, dist1), texture2D(texture2, dist2), dispFactor);
            }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms: { dispFactor: { value: 0.0 }, texture1: { value: textures[0] }, texture2: { value: textures[1] } },
            vertexShader, fragmentShader, transparent: true
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);

        let currentIdx = 0;
        let isAnimating = false;

        function nextSlide() {
            if (isAnimating) return;
            isAnimating = true;
            const nextIdx = (currentIdx + 1) % imageSet.length;
            material.uniforms.texture2.value = textures[nextIdx];

            gsap.to(material.uniforms.dispFactor, {
                value: 1, duration: 1.5, ease: "expo.inOut",
                onComplete: () => {
                    material.uniforms.texture1.value = textures[nextIdx];
                    material.uniforms.dispFactor.value = 0;
                    currentIdx = nextIdx;
                    isAnimating = false;
                }
            });

            if(titleEl) titleEl.innerText = imageSet[nextIdx].title;
            if(artistEl) artistEl.innerText = imageSet[nextIdx].artist;
        }

        setInterval(nextSlide, 4000 + Math.random() * 2000); 
        container.addEventListener('click', nextSlide);

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
        
        if(titleEl) titleEl.innerText = imageSet[0].title;
        if(artistEl) artistEl.innerText = imageSet[0].artist;
    }

    initGallery('art-gallery-container', 'art-title', 'art-artist', lifeImages);
    initGallery('skill-gallery-container', 'skill-title', 'skill-artist', skillImages);
})();
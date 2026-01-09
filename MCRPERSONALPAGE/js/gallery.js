(function() {
    // Images for the Life Gallery
    const images = [
        { url: 'image/me.png', title: 'My Life', artist: 'MEMORIES' }, 
        { url: 'image/family.jpg', title: 'Support', artist: 'FAMILY' },
        { url: 'image/pet2.jpg', title: 'Love', artist: 'PETS' }
    ];

    const container = document.getElementById('art-gallery-container');
    const titleEl = document.getElementById('art-title');
    const artistEl = document.getElementById('art-artist');

    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const textures = images.map(img => loader.load(img.url));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            dispFactor: { value: 0.0 },
            texture1: { value: textures[0] },
            texture2: { value: textures[1] }
        },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
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
        `,
        transparent: true
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let currentIdx = 0;
    let isAnimating = false;

    function nextSlide() {
        if (isAnimating) return;
        isAnimating = true;
        const nextIdx = (currentIdx + 1) % images.length;
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

        if(titleEl) titleEl.innerText = images[nextIdx].title;
        if(artistEl) artistEl.innerText = images[nextIdx].artist;
    }

    setInterval(nextSlide, 5000); // Auto change

    window.addEventListener('resize', () => {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    
    if(titleEl) titleEl.innerText = images[0].title;
    if(artistEl) artistEl.innerText = images[0].artist;
})();
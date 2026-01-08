(function() {
    // --- CONFIGURATION ---
    // You can replace these with your local images like 'image/draww.png'
    const images = [
        { url: 'https://images.unsplash.com/photo-1541119638723-c51cbe2262aa?q=80&w=2073', title: 'The Starry Night' },
        { url: 'https://images.unsplash.com/photo-1543857182-68106299b6b2?q=80&w=2072', title: 'Cafe Terrace at Night' },
        { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1890', title: 'Wheatfield with Crows' }
    ];

    let currentIdx = 0;
    const container = document.getElementById('art-gallery-container');
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- SHADERS ---
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec2 vUv;
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform float dispFactor;
        uniform float effectFactor;

        void main() {
            vec2 uv = vUv;
            vec2 distortedPosition = vec2(uv.x + dispFactor * (sin(uv.y * 10.0 + dispFactor) * (effectFactor * 0.1)), uv.y);
            vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (sin(uv.y * 10.0 + dispFactor) * (effectFactor * 0.1)), uv.y);
            vec4 _texture = texture2D(texture1, distortedPosition);
            vec4 _texture2 = texture2D(texture2, distortedPosition2);
            gl_FragColor = mix(_texture, _texture2, dispFactor);
        }
    `;

    const loader = new THREE.TextureLoader();
    const textures = images.map(img => {
        const tex = loader.load(img.url);
        tex.minFilter = THREE.LinearFilter;
        return tex;
    });

    const mat = new THREE.ShaderMaterial({
        uniforms: {
            dispFactor: { value: 0.0 },
            effectFactor: { value: 0.2 },
            texture1: { value: textures[0] },
            texture2: { value: textures[1] },
        },
        vertexShader,
        fragmentShader,
        transparent: true
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    // --- TRANSITION LOGIC ---
    let isAnimating = false;

    function nextSlide() {
        if (isAnimating) return;
        isAnimating = true;

        const nextIdx = (currentIdx + 1) % images.length;
        mat.uniforms.texture2.value = textures[nextIdx];
        
        gsap.to(mat.uniforms.dispFactor, {
            value: 1,
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                mat.uniforms.texture1.value = textures[nextIdx];
                mat.uniforms.dispFactor.value = 0;
                currentIdx = nextIdx;
                isAnimating = false;
            }
        });

        document.getElementById('art-title').innerText = images[nextIdx].title;
    }

    container.addEventListener('click', nextSlide);

    window.addEventListener('resize', () => {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
})();
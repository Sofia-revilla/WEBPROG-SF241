(function() {
    // Liquid Displacement Shader logic
    const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
    const fragmentShader = `varying vec2 vUv; uniform sampler2D texture1; uniform sampler2D texture2; uniform float dispFactor; void main() { vec2 uv = vUv; vec2 dist1 = vec2(uv.x + dispFactor * (sin(uv.y * 10.0 + dispFactor) * 0.1), uv.y); vec2 dist2 = vec2(uv.x - (1.0 - dispFactor) * (sin(uv.y * 10.0 + dispFactor) * 0.1), uv.y); gl_FragColor = mix(texture2D(texture1, dist1), texture2D(texture2, dist2), dispFactor); }`;

    // Linked to YOUR local images
    const myImages = [
        { url: 'image/draww.png', title: 'Digital Expression' },
        { url: 'image/shs.jpg', title: 'SHS Milestone' },
        { url: 'image/kel.jpg', title: 'Twinkel' },
        { url: 'image/pet2.jpg', title: 'Family' },
        { url: 'image/tal.jpg', title: 'Talia' },
        { url: 'image/nat.jpg', title: 'Nat-Nat' }
    ];

    function initGallery(containerId, titleId, images) {
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
                value: 1, duration: 1.5, ease: "power4.inOut",
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
        
        // Auto-Play: Changes every 6 seconds
        setInterval(() => { if (!isAnimating) transition((currentIdx + 1) % images.length); }, 6000);

        function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); }
        animate();

        window.addEventListener('resize', () => renderer.setSize(container.offsetWidth, container.offsetHeight));
    }

    initGallery('mini-art-gallery', 'mini-art-title', myImages);

    // View All Logic
    const modal = document.getElementById('gallery-modal');
    const viewAllBtn = document.getElementById('view-all-btn');
    const gridContent = document.querySelector('.gallery-grid-content');

    viewAllBtn.addEventListener('click', () => {
        gridContent.innerHTML = '';
        myImages.forEach(img => {
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.innerHTML = `<img src="${img.url}" alt="${img.title}">`;
            gridContent.appendChild(div);
        });
        modal.style.display = "flex";
    });

    document.querySelector('.close-gallery').onclick = () => modal.style.display = "none";
})();
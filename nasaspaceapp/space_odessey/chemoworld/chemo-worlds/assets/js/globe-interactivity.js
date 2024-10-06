// File: js/globe-interactivity.js

let scene, camera, renderer, globe;
const hotspots = [
    { position: [-45.9, 7.9], name: "Thrace Macula", type: "geography" },
    { position: [-46.7, -1.2], name: "Thera Macula", type: "geography" },
    { position: [9.7, -92.7], name: "Conamara Chaos", type: "geography" },
    { position: [-43.8, -33.5], name: "Agenor Linea", type: "geography" },
    { position: [-25.2, -91.4], name: "Pwyll", type: "geography" },
    { position: [2.6, -1.9], name: "Cilix", type: "geography" },
    { position: [33.6, 33.4], name: "Tyre", type: "geography" },
    { position: [19.3, -20.5], name: "Rhadamanthys Linea", type: "geography" },
    { position: [3.1, -59.7], name: "Manann'an", type: "geography" },
    { position: [-14.6, -28.5], name: "Argadnel Regio", type: "geography" },
    { position: [0.992, 0, 0.787], name: "Iron Metallic Core", type: "core" },
    { position: [1.934, 0.916, 0.095], name: "Rocky Interior", type: "core" },
    { position: [2.625, 1.564, 0.102], name: "Ocean", type: "core" },
    { position: [2.512, 1.846, 0.082], name: "Icy Shell", type: "core" }
];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('globe-canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const texture = new THREE.TextureLoader().load('images/blue-marble.png');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    camera.position.z = 10;

    addHotspots();
    animate();
}

function addHotspots() {
    const container = document.querySelector('.webgl_globe_hotspot_container');
    hotspots.forEach((hotspot, index) => {
        const hotspotElement = document.createElement('a');
        hotspotElement.className = `hotspot_wrapper ${hotspot.type === 'core' ? 'hidden' : ''}`;
        hotspotElement.setAttribute('data-position', `[${hotspot.position[0]},${hotspot.position[1]}]`);
        hotspotElement.setAttribute('data-type', hotspot.type);
        hotspotElement.setAttribute('data-idx', index);

        hotspotElement.innerHTML = `
            <div class="hotspot_spacer"><div class="hotspot_dot ${hotspot.type === 'core' ? 'blue_smoke' : 'red_coral'}"></div></div>
            <div class="hotspot_label ${hotspot.type === 'core' ? 'blue_smoke' : 'white'}">${hotspot.name}</div>
        `;

        container.appendChild(hotspotElement);
        positionHotspot(hotspotElement, hotspot.position);
    });
}

function positionHotspot(element, position) {
    const vector = new THREE.Vector3().setFromSpherical(
        new THREE.Spherical(5, THREE.MathUtils.degToRad(90 - position[0]), THREE.MathUtils.degToRad(position[1]))
    );
    vector.project(camera);

    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

    element.style.transform = `translate(${x}px, ${y}px)`;
}

function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.005;
    hotspots.forEach((hotspot, index) => {
        const element = document.querySelector(`.hotspot_wrapper[data-idx="${index}"]`);
        positionHotspot(element, hotspot.position);
    });
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('DOMContentLoaded', init);
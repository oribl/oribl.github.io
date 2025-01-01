// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const modelContainer = document.getElementById('model-container');
modelContainer.appendChild(renderer.domElement);
renderer.setSize(modelContainer.offsetWidth, modelContainer.offsetHeight);

// Add loading manager
const loadingManager = new THREE.LoadingManager();
const progressBar = document.createElement('div');
progressBar.classList.add('progress-bar');
modelContainer.appendChild(progressBar);

// Function to update the progress bar
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    progressBar.style.width = `${progress}%`;
};

// Function to handle loading completion
loadingManager.onLoad = () => {
    progressBar.style.display = 'none';
    animate();
};

renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '10%';
renderer.domElement.style.left = '-5%';
document.body.appendChild(renderer.domElement);

// Global variables for mouse interaction
let mouseX = 0;
let mouseY = 0;
function onMouseMove(event) {
    mouseX = event ? (event.clientX / window.innerWidth) * 2 - 1 : 0;
    mouseY = event ? -(event.clientY / window.innerHeight) * 2 + 1 : 0;
}
document.addEventListener('mousemove', onMouseMove, false);

// Add zoom in and out functionality
function onDocumentMouseWheel(event) {
    const zoomFactor = 0.8;
    if (event.deltaY < 0) {
        camera.position.z -= zoomFactor;
    } else {
        camera.position.z += zoomFactor;
    }
}

document.addEventListener('wheel', onDocumentMouseWheel, false);

// Variable to store materials
const originalMaterials = [];

// Load the GLB model
const loader = new THREE.GLTFLoader();
loader.load(
    'me_1.glb',
    function (gltf) {
        scene.add(gltf.scene);

        // Store references to original materials and customize them
        gltf.scene.traverse((object) => {
            if (object.isMesh) {
                // Customize the existing material
                object.material.color.set(0x004a75); // Deep blue color
                object.material.metalness = 0.8;    // Metallic appearance
                object.material.roughness = 0.3;   // Glossy surface
                object.material.transparent = true; // Enable transparency
                object.material.opacity = 0.7;     // Slight transparency

                // Store the original material for future toggling
                originalMaterials.push(object.material);

                object.material.wireframe = false; // Ensure wireframe is off by default
            }
        });

        animate();
    },
    undefined,
    function (error) {
        console.error('An error occurred while loading the model:', error);
    }
);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
directionalLight1.position.set(1, 2, 2);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4);
directionalLight2.position.set(-1, -1, -2);
scene.add(directionalLight2);

const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 100);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
pointLight2.position.set(-10, -10, -10);
scene.add(pointLight2);

scene.background = new THREE.Color(0xffffff);

const radius = 30;
const cameraAngle = Math.PI / 1;
const cameraX = Math.sin(cameraAngle) * radius;
const cameraZ = Math.cos(cameraAngle) * radius;
camera.position.set(cameraX, 10, cameraZ);
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        scene.traverse(function (object) {
            if (object.isMesh) {
                object.rotation.y += 0.01;
            }
        });
    } else {
        const rotationAngleX = mouseY * Math.PI / 4;
        const rotationAngleY = mouseX * Math.PI / 4;

        scene.traverse(function (object) {
            if (object.isMesh) {
                object.rotation.x = rotationAngleX;
                object.rotation.y = rotationAngleY;
            }
        });
    }

    renderer.render(scene, camera);

    function resizeRenderer() {
        const width = isMobile ? window.innerWidth : modelContainer.offsetWidth;
        const height = isMobile ? window.innerHeight : modelContainer.offsetHeight;
        renderer.setSize(width, height);
        if (isMobile) {
            renderer.domElement.style.top = '20px';
            renderer.domElement.style.left = '20%';
            renderer.domElement.style.width = '60%';
            renderer.domElement.style.height = '60%';
        } else {
            renderer.domElement.style.top = '20%';
            renderer.domElement.style.left = '-5%';
        }
    }

    resizeRenderer();

    function onWindowResize() {
        resizeRenderer();
        camera.aspect = isMobile
            ? window.innerWidth / window.innerHeight
            : modelContainer.offsetWidth / modelContainer.offsetHeight;
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', onWindowResize);
}

// Define different materials
const materials = [
    new THREE.MeshStandardMaterial({ color: 0x004a75, metalness: 1, roughness: .5, transparent: false, opacity: .9 }),
    new THREE.MeshStandardMaterial({
        color: 0xb2b2b2, // 11743794 in hex
        roughness: 0.62,
        metalness: 0.78,
        emissive: 0x000000,
        emissiveIntensity: 0,
        envMapIntensity: 1,
        vertexColors: true,
        transparent: true,
        wireframe: true
    }),
    new THREE.MeshStandardMaterial({
        color: 0xaeaeae, // 11431474 in hex
        roughness: 0.68,
        metalness: 1,
        emissive: 0x000000,
        emissiveIntensity: 0,
        envMapIntensity: 1,
        side: THREE.DoubleSide,
        opacity: 0.52,
        transparent: true,
        forceSinglePass: true
    }),
    new THREE.MeshNormalMaterial(), // Environment mapping set to normals
    new THREE.MeshStandardMaterial({
        color: 0x004a75, // Deep blue color
        metalness: 0.8, // Metallic appearance
        roughness: 0.3, // Glossy surface
        transparent: true, // Enable transparency
        opacity: 0.7, // Slight transparency
        wireframe: false // Ensure wireframe is off by default
    })
];

// Wireframe toggle functionality
let materialIndex = 0;
const wireframeToggleButton = document.getElementById('wireframe-toggle');

wireframeToggleButton.addEventListener('click', () => {
    materialIndex = (materialIndex + 1) % materials.length;

    scene.traverse((object) => {
        if (object.isMesh) {
            object.material = materials[materialIndex];
        }
    });

    // Keep the button color "orange"
    wireframeToggleButton.style.backgroundColor = 'orange';
});

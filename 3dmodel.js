// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
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
    // Hide the progress bar after the model is fully loaded
    progressBar.style.display = 'none';
    // Start the animation loop
    animate();
};

// Optionally, set the position of the canvas element
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '10%';
renderer.domElement.style.left = '-5%';
document.body.appendChild(renderer.domElement);

// Global variables to track mouse position
let mouseX = 0;
let mouseY = 0;

// Function to handle mouse movement
function onMouseMove(event) {
    // Update global mouse position variables
    mouseX = event ? (event.clientX / window.innerWidth) * 2 - 1 : 0;
    mouseY = event ? -(event.clientY / window.innerHeight) * 2 + 1 : 0;
}

// Add event listener for mouse move
document.addEventListener('mousemove', onMouseMove, false);

// Load the GLB model
const loader = new THREE.GLTFLoader();
loader.load('me_1.glb', function (gltf) {
    // Add the model to the scene
    scene.add(gltf.scene);

    // Adjust material properties of the model
    gltf.scene.traverse(function (object) {
        if (object.isMesh) {
            // Set gray material for the object
            object.material = new THREE.MeshStandardMaterial({ color: 0x004a75,  transparent: true, // Enable transparency
            opacity: 0.9,  wireframe: true });
        }
    });

    // Start the animation loop after the model is loaded
    animate();
});

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // White ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Sunlight
directionalLight.position.set(1, 2, 0); // Position the light from the top
scene.add(directionalLight);

// Set background color to white
scene.background = new THREE.Color(0xffffff);

// Position and rotate the camera around the center
const radius = 30;
const cameraAngle = Math.PI / 1; // 45 degrees
const cameraX = Math.sin(cameraAngle) * radius;
const cameraZ = Math.cos(cameraAngle) * radius;
camera.position.set(cameraX, 10, cameraZ);
camera.lookAt(0, 0, 0); // Point the camera towards the origin (center) of the scene

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Check if the device width is less than a certain threshold to detect mobile devices
    const isMobile = window.innerWidth < 768; // Adjust the threshold as needed

    if (isMobile) {
        // Rotate the model continuously for mobile devices
        scene.traverse(function (object) {
            if (object.isMesh) {
                // Rotate the object by a small amount in each frame
                object.rotation.y += 0.01; // Adjust the rotation speed as needed
            }
        });
    } else {
        // Rotate the model based on cursor position for non-mobile devices
        // Calculate rotation angles based on cursor position
        const rotationAngleX = mouseY * Math.PI / 4;
        const rotationAngleY = mouseX * Math.PI / 4;

        // Rotate the model based on cursor position
        scene.traverse(function (object) {
            if (object.isMesh) {
                object.rotation.x = rotationAngleX;
                object.rotation.y = rotationAngleY;
            }
        });
    }

    // Render the scene
    renderer.render(scene, camera);

    // Function to handle resizing of the renderer
function resizeRenderer() {
    const width = isMobile ? window.innerWidth : modelContainer.offsetWidth;
    const height = isMobile ? window.innerHeight : modelContainer.offsetHeight;
    renderer.setSize(width, height);
    // Adjust position for mobile devices
    if (isMobile) {
        renderer.domElement.style.top = '20px'; // Adjust as needed
        renderer.domElement.style.left = '20%';
        renderer.domElement.style.width = '60%';
        renderer.domElement.style.height = '60%';
    } else {
        renderer.domElement.style.top = '20%';
        renderer.domElement.style.left = '-5%';
    }
}

// Adjust the size of the renderer's canvas element
resizeRenderer();

// Function to handle window resize events
function onWindowResize() {
    resizeRenderer();
    camera.aspect = isMobile ? window.innerWidth / window.innerHeight : modelContainer.offsetWidth / modelContainer.offsetHeight;
    camera.updateProjectionMatrix();
}

// Add event listener for window resize events
window.addEventListener('resize', onWindowResize);
}

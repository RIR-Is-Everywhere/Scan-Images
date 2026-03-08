const canvas = document.getElementById("digitalCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");
const dataStream = document.getElementById("data-stream");
const scanBtn = document.getElementById("scanBtn");
const faceImage = document.getElementById("faceImage");

// Set up dynamic random image generation
function getRandomImage() {
    // 0: face_X.jpg (0 to 660 roughly)
    // 1: non-child-X.png (1 to 1366)
    // 2: child-X.png (1367 to 2168)
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
        return `images/face_${Math.floor(Math.random() * 660)}.jpg`;
    } else if (type === 1) {
        return `images/non-child-${Math.floor(Math.random() * 1366) + 1}.png`;
    } else {
        return `images/child-${Math.floor(Math.random() * (2168 - 1367 + 1)) + 1367}.png`;
    }
}

// If an image doesn't exist, instantly try another one
faceImage.onerror = () => {
    faceImage.src = getRandomImage();
};

// Set canvas dimensions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

// Binary Matrix Effect
const chars = "10".split("");
const fontSize = 16;
let columns = canvas.width / fontSize;
let drops = [];

// Initialize drops randomly above the screen
for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * -100;
}

window.addEventListener("resize", () => {
    resizeCanvas();
    const newColumns = canvas.width / fontSize;
    // Add drops if screen gets wider
    for (let x = drops.length; x < newColumns; x++) {
        drops[x] = Math.random() * -100;
    }
});

let isScanning = false;
let faceScanInterval = null;

function drawMatrix() {
    // Fading effect for trail
    // Reset shadow so the background fade doesn't glow
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add intense neon cyan glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffff";

    // Color changes if actively scanning
    // Use neon cyan for the rain
    ctx.fillStyle = isScanning ? "rgba(0, 255, 255, 0.5)" : "#00ffff";
    ctx.font = fontSize + "px 'Share Tech Mono'";

    for (let i = 0; i < drops.length; i++) {
        if (drops[i] >= 0) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        }

        // Reset if it passes canvas height with a random chance
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
            drops[i] = 0;
        } else {
            drops[i]++;
        }
    }
}

// Drive the canvas animation ~ 30 FPS
setInterval(drawMatrix, 35);

// Random hack data stream log
setInterval(() => {
    if (isScanning) {
        let hex1 = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
        let hex2 = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
        dataStream.innerText = `[SECURE-X] 0x${hex1} - PORT ${hex2}\nPACKETS: ${Math.floor(Math.random() * 9000 + 1000)}`;
    } else {
        dataStream.innerText = "AWAITING USER INPUT...";
    }
}, 80);

// Fake Hacker Scan Logic
scanBtn.addEventListener("click", () => {
    if (isScanning) return; // Prevent multiple clicks

    isScanning = true;
    scanBtn.innerText = "ACCESSING...";
    scanBtn.style.opacity = "0.5";
    scanBtn.style.pointerEvents = "none";
    statusText.innerText = "BYPASSING FIREWALL...";

    // Quick flash effect when initiated
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Show the face image element and start scanning
    faceImage.style.display = "block";
    faceScanInterval = setInterval(() => {
        // Pick a random image using our dynamic function
        faceImage.src = getRandomImage();
    }, 100); // changes face every 100ms

    // Simulate different hacking stages
    setTimeout(() => { statusText.innerText = "ISOLATING FACIAL TARGETS..."; }, 1500);
    setTimeout(() => { statusText.innerText = "CROSS-REFERENCING DATABASE..."; }, 3500);
    setTimeout(() => { statusText.innerText = "MATCH FOUND. LOCKING TARGET..."; }, 5500);
    setTimeout(() => { statusText.innerText = "EXTRACTING PROFILE..."; }, 7000);

    setTimeout(() => {
        // Stop scanning images
        clearInterval(faceScanInterval);

        // Pick the final suspected face
        faceImage.src = getRandomImage();

        statusText.innerText = "SUSPECT IDENTIFIED.";
        statusText.style.color = "#00ff3c";
        statusText.style.textShadow = "0 0 10px #00ff3c";

        ctx.fillStyle = "rgba(0, 255, 60, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        dataStream.innerText = "TARGET PROFILE EXTRACTED.";

        // Reset everything back to standby
        setTimeout(() => {
            isScanning = false;
            faceImage.style.display = "none";
            scanBtn.innerText = "INITIATE UPLINK";
            scanBtn.style.opacity = "1";
            scanBtn.style.pointerEvents = "auto";
            statusText.style.color = "#00ffff";
            statusText.style.textShadow = "0 0 5px #00ffff";
            statusText.innerText = "SYSTEM STANDBY...";
        }, 5000);
    }, 9000);
});
const textElement = document.getElementById('breathing-text');

const totalTime = 10378.005; // exact cycle time in ms (10.378005s)
const inhaleStart = 1800; // 1.8s
const exhaleStart = 5000; // 5.0s
const pauseStart = 9000; // 9.0s

let startTime = performance.now();

function updateBreathingText() {
    const now = performance.now();
    let elapsed = (now - startTime) % totalTime;

    if (elapsed < inhaleStart) {
        textElement.innerText = 'Pause...';
    } else if (elapsed < exhaleStart) {
        textElement.innerText = 'Inhale...';
    } else if (elapsed < pauseStart) {
        textElement.innerText = 'Exhale...';
    } else {
        textElement.innerText = 'Pause...';
    }

    requestAnimationFrame(updateBreathingText);
}

// Start sync loop
updateBreathingText();

// Ensure video stays aligned with cycle
const video = document.querySelector('.memoji-video');
if (video) {
    video.currentTime = 0;
    video.play().catch(() => {
        console.log("Autoplay prevented");
        document.body.addEventListener('click', () => video.play(), { once: true });
    });
}

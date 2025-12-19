const textElement = document.getElementById('breathing-text');
const video = document.querySelector('.memoji-video');

// Exact cycle timing (ms)
const totalTime = 10378.005;
const inhaleStart = 1800;
const exhaleStart = 5000;
const pauseStart = 9000;

let startTime = null;

function updateBreathingText() {
    if (startTime === null) return;

    const now = performance.now();
    const elapsed = (now - startTime) % totalTime;

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

/**
 * Start everything in perfect sync
 * ONLY once the video is ready and seeked
 */
function startSyncedPlayback() {
    video.currentTime = 0;

    const playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            startTime = performance.now();
            requestAnimationFrame(updateBreathingText);
        }).catch(() => {
            console.log('Autoplay prevented');

            document.body.addEventListener('click', () => {
                video.play().then(() => {
                    startTime = performance.now();
                    requestAnimationFrame(updateBreathingText);
                });
            }, { once: true });
        });
    }
}

// iOS-safe readiness check
if (video) {
    if (video.readyState >= 2) {
        startSyncedPlayback();
    } else {
        video.addEventListener('loadedmetadata', startSyncedPlayback, { once: true });
    }
}

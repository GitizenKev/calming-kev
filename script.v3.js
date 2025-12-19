const textElement = document.getElementById('breathing-text');
const video = document.querySelector('.memoji-video');

// Exact cycle timing (ms)
const totalTime = 10378.005;
const inhaleStart = 1800;
const exhaleStart = 5000;
const pauseStart = 9000;

let startTime = null;

let previousState = 'PAUSE';

function updateBreathingText() {
    if (startTime === null) return;

    const now = performance.now();
    const elapsed = (now - startTime) % totalTime;

    let currentState;
    let text;

    if (elapsed < inhaleStart) {
        currentState = 'PAUSE';
        text = 'Pause...';
    } else if (elapsed < exhaleStart) {
        currentState = 'INHALE';
        text = 'Inhale...';
    } else if (elapsed < pauseStart) {
        currentState = 'EXHALE';
        text = 'Exhale...';
    } else {
        currentState = 'PAUSE';
        text = 'Pause...';
    }

    // Update text
    if (textElement.innerText !== text) {
        textElement.innerText = text;
    }

    // Haptic Feedback on State Change
    if (currentState !== previousState) {
        if (currentState === 'INHALE') {
            // Short pulse (20ms) for awareness
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(20);
            }
        } else if (currentState === 'EXHALE') {
            // slightly longer pulse (30ms) for release
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(30);
            }
        }
        previousState = currentState;
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

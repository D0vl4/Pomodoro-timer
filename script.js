// Set the focus duration in minutes
const focusDuration = 1; // Example: 1 minute

// Set the break duration in minutes
const breakDuration = 1; // Example: 1 minute

// Convert minutes to milliseconds
const focusDurationMs = focusDuration * 60 * 1000;
const breakDurationMs = breakDuration * 60 * 1000;

let timerInterval;
let currentTime;

// Update the countdown timer
function updateTimer() {
  const timerElement = document.getElementById('timer');
  const minutes = Math.floor((currentTime % (60 * 60 * 1000)) / (60 * 1000))
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((currentTime % (60 * 1000)) / 1000)
    .toString()
    .padStart(2, '0');
  timerElement.textContent = `${minutes}:${seconds}`;
}

// Create an audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Fetch and decode the audio file
function fetchAudioFile(url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer));
}

// Play notification sound
function playNotificationSound() {
  // Replace 'notification-sound.mp3' with the path to your desired sound file
  fetchAudioFile('./sound/sound.mp3')
    .then((audioBuffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    })
    .catch((error) => console.error('Error decoding audio data:', error));
}

// Start the timer
function startTimer() {
  const startTime = Date.now();
  const endTime = startTime + focusDurationMs;

  timerInterval = setInterval(() => {
    currentTime = endTime - Date.now();

    if (currentTime <= 0) {
      clearInterval(timerInterval);
      playNotificationSound();
      alert('Focus time is over. Great job! Take a break!');
      startBreakTimer();
    } else {
      updateTimer();
    }
  }, 1000);
}

// Start the break timer
function startBreakTimer() {
  const startTime = Date.now();
  const endTime = startTime + breakDurationMs;

  timerInterval = setInterval(() => {
    currentTime = endTime - Date.now();

    if (currentTime <= 0) {
      clearInterval(timerInterval);
      playNotificationSound();
      alert(
        'Break time is over. Hope you had your rest. Focus time is about to start!'
      );
      startTimer();
    } else {
      updateTimer();
    }
  }, 1000);
}

// Reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  currentTime = 0;
  updateTimer();
}

// Add event listeners to buttons
document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('stop').addEventListener('click', resetTimer);

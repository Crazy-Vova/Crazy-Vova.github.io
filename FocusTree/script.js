document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const video = document.getElementById("videoTree");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const sessionMessage = document.getElementById("sessionMessage");
  const message = document.getElementById("message");

  const handle = document.querySelector(".slider-handle");
  const fillLeft = document.querySelector(".slider-fill-left");
  const fillRight = document.querySelector(".slider-fill-right");
  const sliderLine = document.querySelector(".slider-line");

  const minMinutes = 1;
  const maxMinutes = 60;

  let duration = 5 * 60; // default 5 хв
  let startTime = null;
  let elapsed = 0;
  let animationFrameId = null;
  let isRunning = false;
  let isDragging = false;
  let usePlaybackRate = true; // чи використовувати play + playbackRate

  // ===== FUNCTIONS =====
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function setTime(minutes) {
    duration = minutes * 60;
    elapsed = 0;
    display.textContent = formatTime(duration);
    usePlaybackRate = minutes <= 14; // якщо більше 14 хв, старий метод

    const percent = (minutes - minMinutes) / (maxMinutes - minMinutes);
    const fillWidthPercent = percent * 50;
    fillLeft.style.width = fillWidthPercent + "%";
    fillRight.style.width = fillWidthPercent + "%";
    handle.style.left = `calc(50% + ${fillWidthPercent}%)`;
  }

  function showFailureMessage() {
    message.textContent = "Session cancelled — you left the tab.";
    message.style.color = "#ef4444";
    message.style.opacity = "1";
    resetBtn.textContent = "Reset";
    handle.style.opacity = "1";
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
    video.pause();
    video.currentTime = 0;
    setTime(5);
    restoreControls();
  }

  function showOnlyAgain() {
    startBtn.classList.add("hidden");
    pauseBtn.classList.add("hidden");
    resetBtn.classList.remove("hidden");
    resetBtn.textContent = "Again";
  }

  function restoreControls() {
    startBtn.classList.remove("hidden");
    pauseBtn.classList.remove("hidden");
    resetBtn.classList.remove("hidden");
    resetBtn.textContent = "Reset";
  }

  // ===== SLIDER =====
  /*
  handle.addEventListener("mousedown", () => (isDragging = true));
  document.addEventListener("mouseup", () => (isDragging = false));
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const rect = sliderLine.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    let distance = e.clientX - center;
    const maxDistance = rect.width / 2;
    distance = Math.max(0, Math.min(distance, maxDistance));
    const percent = distance / maxDistance;
    const minutes = Math.round(minMinutes + percent * (maxMinutes - minMinutes));
    duration = minutes * 60;
    display.textContent = formatTime(duration);
    setTime(minutes); // також оновлює usePlaybackRate
  });
*/



  // ===== SLIDER (mouse + touch) =====
  handle.addEventListener("pointerdown", (e) => {
    isDragging = true;
    handle.setPointerCapture(e.pointerId);
  });

  document.addEventListener("pointerup", () => {
    isDragging = false;
  });

  document.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const rect = sliderLine.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    let distance = e.clientX - center;
    const maxDistance = rect.width / 2;

    distance = Math.max(0, Math.min(distance, maxDistance));
    const percent = distance / maxDistance;

    const minutes = Math.round(
      minMinutes + percent * (maxMinutes - minMinutes)
    );

    setTime(minutes);
  });









  // ===== TIMER UPDATE =====
  function update() {
    if (!isRunning) return;
    const now = Date.now();
    elapsed = Math.floor((now - startTime) / 1000);
    const timeLeft = duration - elapsed;

    // прогрес для slider
    const percentLeft = timeLeft / duration;
    const shrinkWidth = percentLeft * 50;
    fillLeft.style.width = shrinkWidth + "%";
    fillRight.style.width = shrinkWidth + "%";

    if (timeLeft <= 0) {
      display.textContent = "0:00";
      video.pause();
      if (usePlaybackRate) {
        video.currentTime = video.duration;
      }
      launchConfetti();
      sessionMessage.style.opacity = "1";
      showOnlyAgain();
      return;
    }

    display.textContent = formatTime(timeLeft);

    // старий метод для довгих сесій
    if (!usePlaybackRate && video.duration) {
      video.currentTime = (elapsed / duration) * video.duration;
    }

    animationFrameId = requestAnimationFrame(update);
  }

  // ===== BUTTONS =====
  startBtn.addEventListener("click", () => {
    message.textContent = "";
    sessionMessage.style.opacity = "0";
    video.pause();
    video.currentTime = 0;
    video.loop = false;


    handle.style.transition = "opacity 0.3s";
    handle.style.opacity = "0";

    fillLeft.style.width = "50%";
    fillRight.style.width = "50%";

    if (isRunning) return;
    isRunning = true;
    startTime = Date.now() - elapsed * 1000;

    if (usePlaybackRate) {
      video.play();
      video.playbackRate = video.duration / duration;
    } else {
      video.pause(); // старий метод — ми будемо самі оновлювати currentTime
    }

    requestAnimationFrame(update);
  });

  pauseBtn.addEventListener("click", () => {
    if (!isRunning) return;
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
    video.pause();
  });

  resetBtn.addEventListener("click", () => {
    video.pause();
    video.currentTime = 0;

    if (resetBtn.textContent === "Again") {
      sessionMessage.style.opacity = "0";
      handle.style.opacity = "1";
      restoreControls();
      setTime(5);
      startIdleVideoLoop();
      isRunning = false;
      return;
    }

    handle.style.opacity = "1";
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
    setTime(5);
    startIdleVideoLoop();
  });

  // ===== PAGE VISIBILITY =====
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && isRunning) {
      showFailureMessage();
    }
  });


  function startIdleVideoLoop() {
    video.playbackRate = 2;
    video.loop = true;
    video.play().catch(() => {});
  }
  // ===== INITIAL =====
  setTime(5);
  startIdleVideoLoop();
});

// ===== CONFETTI =====
function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#fff']
  });

  setTimeout(() => {
    confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#fff'] });
  }, 200);

  setTimeout(() => {
    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#fff'] });
  }, 400);


}

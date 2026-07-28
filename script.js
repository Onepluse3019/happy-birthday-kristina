document.querySelectorAll("[data-scroll]").forEach(button => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    target?.scrollIntoView({ behavior: "smooth" });
  });
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("pageLoader")?.classList.add("hidden");
  }, 1400);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(section => {
  revealObserver.observe(section);
});

const surpriseButton = document.getElementById("surpriseButton");
const hiddenMessage = document.getElementById("hiddenMessage");
const typedMessage = document.getElementById("typedMessage");
const finalLoveLine = document.getElementById("finalLoveLine");
let messageWasTyped = false;

surpriseButton.addEventListener("click", () => {
  const isOpening = !hiddenMessage.classList.contains("show");
  hiddenMessage.classList.toggle("show");

  surpriseButton.textContent = hiddenMessage.classList.contains("show")
    ? "Скрыть поздравление"
    : "Открыть поздравление";

  if (isOpening) {
    createPetalBurst(55);
    if (!messageWasTyped) {
      messageWasTyped = true;
      typeFinalMessage();
    }
  }
});

function typeFinalMessage() {
  if (!typedMessage) return;

  const parts = typedMessage.dataset.text.split("||");
  typedMessage.innerHTML = "";

  let partIndex = 0;
  let charIndex = 0;
  let currentParagraph = document.createElement("p");
  currentParagraph.classList.add("typing-cursor");
  typedMessage.appendChild(currentParagraph);

  const timer = setInterval(() => {
    if (partIndex >= parts.length) {
      clearInterval(timer);
      currentParagraph.classList.remove("typing-cursor");
      setTimeout(() => {
        finalLoveLine?.classList.add("show");
        createPetalBurst(40);
      }, 500);
      return;
    }

    const currentText = parts[partIndex];

    if (charIndex < currentText.length) {
      currentParagraph.textContent += currentText[charIndex];
      charIndex++;
      return;
    }

    currentParagraph.classList.remove("typing-cursor");
    partIndex++;
    charIndex = 0;

    if (partIndex < parts.length) {
      currentParagraph = document.createElement("p");

      if (partIndex === parts.length - 1) {
        currentParagraph.classList.add("signature");
      }

      currentParagraph.classList.add("typing-cursor");
      typedMessage.appendChild(currentParagraph);
    }
  }, 32);
}

function createPetal() {
  const petal = document.createElement("span");
  const symbols = ["🌼", "🤍", "✨", "🌸"];
  petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = 4 + Math.random() * 4 + "s";
  petal.style.opacity = 0.55 + Math.random() * 0.45;
  petal.style.fontSize = 18 + Math.random() * 18 + "px";

  document.querySelector(".petals").appendChild(petal);
  setTimeout(() => petal.remove(), 8500);
}

function createPetalBurst(amount = 28) {
  for (let i = 0; i < amount; i++) {
    setTimeout(createPetal, i * 55);
  }
}

setInterval(createPetal, 1700);


const musicButton = document.getElementById("musicButton");
const music = document.getElementById("bgMusic");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");
const musicProgressFill = document.getElementById("musicProgressFill");

function setMusicState(isPlaying) {
  musicIcon.textContent = isPlaying ? "⏸️" : "🎵";
  musicText.textContent = isPlaying ? "Остановить музыку" : "Включить музыку";
  musicButton.setAttribute("aria-label", musicText.textContent);
}

musicButton?.addEventListener("click", async () => {
  if (!music) return;

  try {
    if (music.paused) {
      music.volume = 0.72;
      await music.play();
      setMusicState(true);
    } else {
      music.pause();
      setMusicState(false);
    }
  } catch (error) {
    console.error("Не удалось включить музыку:", error);
    musicText.textContent = "Распакуй архив и открой заново";
    setTimeout(() => setMusicState(false), 3500);
  }
});

music?.addEventListener("timeupdate", () => {
  if (!music.duration || !musicProgressFill) return;
  musicProgressFill.style.width = `${(music.currentTime / music.duration) * 100}%`;
});

music?.addEventListener("ended", () => {
  music.currentTime = 0;
  setMusicState(false);
  if (musicProgressFill) musicProgressFill.style.width = "0%";
});

music?.addEventListener("error", () => {
  if (musicText) musicText.textContent = "Музыка не загрузилась";
});

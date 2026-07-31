
const TARGET_HASH = "c6608ff7dcafab5d817b3a95bbe3af3e8e9f8ad07afd26ce9dc0b942ae3c697f";

async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// --- Hint toggle ---
const hintBtn = document.getElementById("hintBtn");
const hintBody = document.getElementById("hintBody");
hintBtn.addEventListener("click", () => {
  const showing = hintBody.classList.toggle("show");
  hintBtn.textContent = showing ? "Hide Hint" : "Reveal Hint";
});

// --- Submission logic ---
const flagInput = document.getElementById("flagInput");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");
const attemptsLabel = document.getElementById("attemptsLabel");
const gate1 = document.getElementById("gate1");
const gate2 = document.getElementById("gate2");
const successOverlay = document.getElementById("successOverlay");
const successFlagText = document.getElementById("successFlagText");
const closeBtn = document.getElementById("closeBtn");
const panelHolder = document.querySelector(".submit-row").closest(".panel");

let attempts = 0;

async function checkFlag() {
  const guess = flagInput.value.trim();
  if (!guess) {
    feedback.textContent = "Enter something to check first.";
    feedback.className = "feedback fail";
    return;
  }
// --> WkdocGJtRnJZWEpoYmw5MGFHRnRZbWxmYVhOZmRHaGxYMk4xYkhCeWFYUUsK //
  attempts++;
  attemptsLabel.textContent = "Attempts: " + attempts;

  const guessHash = await sha256Hex(guess);

  if (guessHash === TARGET_HASH) {
    gate1.classList.add("open");
    setTimeout(() => gate2.classList.add("open"), 350);
    feedback.textContent = "Match confirmed. Both gates open.";
    feedback.className = "feedback ok";
    successFlagText.textContent = guess;
    setTimeout(() => successOverlay.classList.add("show"), 700);
  } else {
    feedback.textContent = "No match. Wrong layer, or not fully decoded yet.";
    feedback.className = "feedback fail";
    panelHolder.classList.remove("glitch");
    void panelHolder.offsetWidth; // restart animation
    panelHolder.classList.add("glitch");
  }
}

submitBtn.addEventListener("click", checkFlag);
flagInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkFlag();
});

closeBtn.addEventListener("click", () => {
  successOverlay.classList.remove("show");
});

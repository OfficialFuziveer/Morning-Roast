const message = "Happy Valentine's Day! They say that home is a place, but for me, home is a person—and that person is you. You make the world more beautiful just by being in it. I love you more than words can ever express.";
let i = 0;
let startedTyping = false;

function typeWriter() {
  if (i < message.length) {
    document.getElementById("typewriter").innerHTML += message.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        if (entry.target.id === "typewriter-box" && !startedTyping) {
          startedTyping = true;
          typeWriter();
        }
      }
    });
  },
  { threshold: 0.3 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const romanticColors = ["#fff0f3", "#ffecf2", "#f3e8ff", "#eefbff", "#fff9db", "#e0fcf5", "#fff4e6", "#f0fff4", "#f8f0fc", "#fff5f5", "#e6fcf5", "#fffaf0"];

let availableColors = [...romanticColors];

function getNextColor() {
  if (availableColors.length === 0) {
    availableColors = [...romanticColors];
  }
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors.splice(randomIndex, 1)[0];
}

document.querySelectorAll(".love-card").forEach((card) => {
  card.addEventListener("click", function () {
    if (!this.classList.contains("flipped")) {
      const cardBack = this.querySelector(".card-back");
      cardBack.style.backgroundColor = getNextColor();

      this.classList.add("flipped");
      setTimeout(() => {
        shootConfetti(this);
      }, 300);
    } else {
      this.classList.remove("flipped");
    }
  });
});

function shootConfetti(card) {
  const shapes = ["✦", "✨", "❤", "✺", "▫", "🌸"];
  const colors = ["#ff4d6d", "#ff8fa3", "#7209b7", "#4895ef", "#f72585"];
  const container = card.querySelector(".card-back");

  for (let j = 0; j < 35; j++) {
    const confetti = document.createElement("div");
    confetti.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
    confetti.style.position = "absolute";
    confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = "50%";
    confetti.style.top = "50%";
    confetti.style.fontSize = Math.random() * 18 + 10 + "px";
    confetti.style.pointerEvents = "none";
    confetti.style.zIndex = "100";

    const angle = Math.random() * Math.PI * 2;
    const velocity = 120 + Math.random() * 180;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity;

    container.appendChild(confetti);

    const animation = confetti.animate(
      [
        { transform: "translate(-50%, -50%) scale(0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${destX * 0.7}px), calc(-50% + ${destY * 0.7}px)) scale(1.8) rotate(180deg)`,
          opacity: 1,
          offset: 0.3,
        },
        { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0) rotate(360deg)`, opacity: 0 },
      ],
      {
        duration: 900 + Math.random() * 700,
        easing: "ease-out",
      },
    );

    animation.onfinish = () => confetti.remove();
  }
}

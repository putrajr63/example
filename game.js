const config = window.MUSEUM_CONFIG;

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const roomLabel = document.querySelector("#room-label");
const sceneMedia = document.querySelector("#scene-media");
const sceneKicker = document.querySelector("#scene-kicker");
const sceneTitle = document.querySelector("#scene-title");
const sceneDescription = document.querySelector("#scene-description");
const sceneFacts = document.querySelector("#scene-facts");
const resetButton = document.querySelector("#reset-button");

const keys = new Set();
const heldButtons = new Set();
const playerImage = new Image();
let playerImageReady = false;
let activeRoom = null;
let lastTime = performance.now();

const player = {
  x: config.player.start.x,
  y: config.player.start.y,
  width: config.player.size.width,
  height: config.player.size.height,
  speed: config.player.speed,
  direction: "down"
};

if (config.player.image) {
  playerImage.onload = () => {
    playerImageReady = true;
  };
  playerImage.src = config.player.image;
}

function setPage(page, label = "Main Hall") {
  roomLabel.textContent = label;
  sceneKicker.textContent = page.kicker;
  sceneTitle.textContent = page.title;
  sceneDescription.textContent = page.description;
  sceneFacts.replaceChildren(
    ...page.facts.map((fact) => {
      const item = document.createElement("li");
      item.textContent = fact;
      return item;
    })
  );
  sceneMedia.style.backgroundImage = page.image
    ? `linear-gradient(rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02)), url("${page.image}")`
    : "";
}

function resetGame() {
  player.x = config.player.start.x;
  player.y = config.player.start.y;
  player.direction = "down";
  activeRoom = null;
  setPage(config.welcome);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rectanglesTouch(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function getMovementVector() {
  let dx = 0;
  let dy = 0;

  if (keys.has("arrowup") || keys.has("w") || heldButtons.has("up")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s") || heldButtons.has("down")) dy += 1;
  if (keys.has("arrowleft") || keys.has("a") || heldButtons.has("left")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d") || heldButtons.has("right")) dx += 1;

  if (dx !== 0 && dy !== 0) {
    const diagonal = Math.SQRT1_2;
    dx *= diagonal;
    dy *= diagonal;
  }

  if (Math.abs(dx) > Math.abs(dy)) player.direction = dx > 0 ? "right" : "left";
  if (Math.abs(dy) > Math.abs(dx)) player.direction = dy > 0 ? "down" : "up";

  return { dx, dy };
}

function update(deltaSeconds) {
  const { dx, dy } = getMovementVector();
  player.x = clamp(player.x + dx * player.speed * deltaSeconds, 40, canvas.width - player.width - 40);
  player.y = clamp(player.y + dy * player.speed * deltaSeconds, 130, canvas.height - player.height - 44);

  const room = config.rooms.find((candidate) => rectanglesTouch(player, candidate.doorway));
  if (room && activeRoom !== room.id) {
    activeRoom = room.id;
    player.x = room.spawn.x;
    player.y = room.spawn.y;
    setPage(room.page, room.label);
  }
}

function drawFloor() {
  ctx.fillStyle = "#efe5d6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#d8c7ad";
  ctx.fillRect(0, 0, canvas.width, 132);

  ctx.fillStyle = "#c4b091";
  for (let x = 0; x < canvas.width; x += 80) {
    ctx.fillRect(x, 132, 2, canvas.height - 132);
  }
  for (let y = 160; y < canvas.height; y += 64) {
    ctx.fillRect(0, y, canvas.width, 2);
  }

  ctx.fillStyle = "#6a5741";
  ctx.fillRect(0, 122, canvas.width, 14);
  ctx.fillStyle = "#fffaf1";
  ctx.fillRect(34, 168, canvas.width - 68, canvas.height - 228);
  ctx.strokeStyle = "#c8b99f";
  ctx.lineWidth = 4;
  ctx.strokeRect(34, 168, canvas.width - 68, canvas.height - 228);
}

function drawDoorways() {
  config.rooms.forEach((room) => {
    const { doorway } = room;
    ctx.fillStyle = room.color;
    ctx.fillRect(doorway.x, doorway.y, doorway.width, doorway.height);
    ctx.fillStyle = "#221b18";
    ctx.fillRect(doorway.x + 14, doorway.y + 14, doorway.width - 28, doorway.height);

    ctx.fillStyle = "#fff8ea";
    ctx.font = "700 18px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(room.label, doorway.x + doorway.width / 2, doorway.y - 20);

    ctx.fillStyle = room.color;
    ctx.fillRect(doorway.x + 24, doorway.y + 32, doorway.width - 48, 8);
  });
}

function drawMuseumDetails() {
  ctx.fillStyle = "#7d664b";
  ctx.fillRect(66, 472, 130, 20);
  ctx.fillRect(764, 472, 130, 20);

  ctx.fillStyle = "#2f6f73";
  ctx.beginPath();
  ctx.arc(140, 432, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#d29a36";
  ctx.fillRect(794, 402, 72, 56);

  ctx.fillStyle = "#69533b";
  ctx.font = "600 20px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Main Hall", canvas.width / 2, 520);
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);

  if (playerImageReady) {
    ctx.drawImage(playerImage, 0, 0, player.width, player.height);
    ctx.restore();
    return;
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.beginPath();
  ctx.ellipse(player.width / 2, player.height + 2, player.width / 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#355c7d";
  ctx.fillRect(8, 20, player.width - 16, 25);

  ctx.fillStyle = "#f0c6a8";
  ctx.beginPath();
  ctx.arc(player.width / 2, 13, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2b211d";
  ctx.fillRect(9, 3, player.width - 18, 8);

  ctx.strokeStyle = "#1f303f";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(13, 43);
  ctx.lineTo(10, 54);
  ctx.moveTo(player.width - 13, 43);
  ctx.lineTo(player.width - 10, 54);
  ctx.stroke();

  ctx.fillStyle = "#211815";
  if (player.direction === "left") ctx.fillRect(10, 12, 4, 4);
  if (player.direction === "right") ctx.fillRect(player.width - 14, 12, 4, 4);
  if (player.direction === "down") {
    ctx.fillRect(14, 12, 4, 4);
    ctx.fillRect(player.width - 18, 12, 4, 4);
  }

  ctx.restore();
}

function draw() {
  drawFloor();
  drawDoorways();
  drawMuseumDetails();
  drawPlayer();
}

function loop(time) {
  const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  update(deltaSeconds);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
    event.preventDefault();
    keys.add(key);
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

document.querySelectorAll("[data-move]").forEach((button) => {
  const direction = button.dataset.move;
  button.addEventListener("pointerdown", (event) => {
    button.setPointerCapture?.(event.pointerId);
    heldButtons.add(direction);
  });
  button.addEventListener("pointerup", () => heldButtons.delete(direction));
  button.addEventListener("pointercancel", () => heldButtons.delete(direction));
  button.addEventListener("pointerleave", () => heldButtons.delete(direction));
});

resetButton.addEventListener("click", resetGame);

resetGame();
requestAnimationFrame(loop);

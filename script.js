import { db } from "./firebasedata.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const viewKey = params.get("view");

const snap = await get(ref(db, `dates/${viewKey}`));
const dates = snap.val();

if (!dates || !viewKey) {
  document.body.innerHTML = "<h2>ungültiger link</h2>";
}
if (!dates?.start || !dates?.caption || !dates?.color || !dates?.end) {
  document.body.innerHTML = "<h2>ungültige datenstruktur</h2>";
}

const start = new Date(dates.start);
const end = new Date(dates.end);

const today = new Date();
today.setHours(0,0,0,0);

const oneDay = 1000 * 60 * 60 * 24;

const totalDays = Math.round((end - start) / oneDay);
const passedDays = Math.max(0, Math.round((today - start) / oneDay));
const leftDays = Math.max(0, totalDays - passedDays);

const progress = Math.min(100, Math.round((passedDays / totalDays) * 100));

// ---- UI ----
document.getElementById("startDate").textContent = start.toLocaleDateString("de-DE");
document.getElementById("todayDate").textContent = today.toLocaleDateString("de-DE");
document.getElementById("endDate").textContent = end.toLocaleDateString("de-DE");

document.getElementById("daysTotal").textContent = totalDays;
document.getElementById("daysPassed").textContent = passedDays;
document.getElementById("daysLeft").textContent = leftDays;

document.getElementById("progress").style.width = progress + "%";
document.getElementById("progress").style.background = `linear-gradient(90deg, ${dates.color}, ${lightenColor(dates.color, 100)})`;
document.getElementById("progressText").textContent = progress + "% geschafft";

document.getElementById("caption").textContent = dates.caption;

function lightenColor(hex, amount = 40) {
  hex = hex.replace("#", "");

  let r = parseInt(hex.substring(0,2), 16);
  let g = parseInt(hex.substring(2,4), 16);
  let b = parseInt(hex.substring(4,6), 16);

  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);

  return `rgb(${r}, ${g}, ${b})`;
}

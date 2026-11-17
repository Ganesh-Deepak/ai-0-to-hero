// Four times of day. Each mood is a full palette for the paintings and
// decides whether the interface is painted on paper (light) or at night.

export const MOODS = {
  dawn: {
    id: "dawn",
    name: "Dawn",
    scheme: "light",
    sky: ["#8ea3c4", "#d9b2b0", "#f4d5ad"],
    bloom: "#ffe2b8",
    body: { kind: "sun", x: 0.79, y: 0.58, r: 0.05, color: "#fff2d2", glow: "#ffcf96" },
    cloud: "#f7e1d6",
    cloudShade: "#b99aa8",
    cloudOpacity: 0.85,
    haze: "#f1d3b8",
    land: ["#b4a6b8", "#958ea6", "#76838a", "#5b6f5f", "#3a4a3b"],
    tree: "#334234",
    sea: ["#c9c3cf", "#8f97ad"],
    grass: "#2c3a2d",
    dabs: ["#e8b04f", "#d77a6a", "#f1e2c6"],
    ink: "#2a2230",
    road: "#efe2c6",
    walked: "#e0a33c",
    stars: false,
  },
  day: {
    id: "day",
    name: "Day",
    scheme: "light",
    sky: ["#6d93c4", "#a8c4dc", "#ece4c9"],
    bloom: "#fff6da",
    body: { kind: "sun", x: 0.8, y: 0.18, r: 0.042, color: "#fffbea", glow: "#fff0bf" },
    cloud: "#fbf8ef",
    cloudShade: "#b9c4cf",
    cloudOpacity: 0.92,
    haze: "#e6e6d8",
    land: ["#a3b6c6", "#86a1b1", "#728f6f", "#58774f", "#344b2f"],
    tree: "#2f4429",
    sea: ["#a9c3d6", "#5f85a6"],
    grass: "#26371f",
    dabs: ["#e9c14e", "#e6e0cf", "#c9584a"],
    ink: "#1d2730",
    road: "#efe6cf",
    walked: "#d79a2b",
    stars: false,
  },
  dusk: {
    id: "dusk",
    name: "Dusk",
    scheme: "light",
    sky: ["#3b3a6a", "#b25d78", "#f2a65f"],
    bloom: "#ffb36e",
    body: { kind: "sun", x: 0.28, y: 0.64, r: 0.06, color: "#ffd889", glow: "#ff8f5a" },
    cloud: "#f3a97f",
    cloudShade: "#6e4569",
    cloudOpacity: 0.8,
    haze: "#d98a7a",
    land: ["#77567c", "#5f4669", "#4a3753", "#35283e", "#1f1827"],
    tree: "#1d1524",
    sea: ["#d7907e", "#4e3c63"],
    grass: "#171119",
    dabs: ["#f0b45a", "#e0707a", "#f6d7a8"],
    ink: "#fbeee0",
    road: "#d9b8a6",
    walked: "#ffc35c",
    stars: false,
  },
  night: {
    id: "night",
    name: "Night",
    scheme: "dark",
    sky: ["#0b1124", "#1b284a", "#3a4a6e"],
    bloom: "#9fb4d8",
    body: { kind: "moon", x: 0.76, y: 0.2, r: 0.032, color: "#f3ecd6", glow: "#9fb4d8" },
    cloud: "#4a5a7f",
    cloudShade: "#151d33",
    cloudOpacity: 0.55,
    haze: "#3d4c70",
    land: ["#2b3756", "#232d48", "#1b233a", "#141b2d", "#0c111f"],
    tree: "#0b0f1b",
    sea: ["#33456b", "#111a30"],
    grass: "#070a14",
    dabs: ["#e9d9a4", "#8fa6d6", "#f3ecd6"],
    ink: "#efe7d6",
    road: "#55638a",
    walked: "#f0c66a",
    stars: true,
  },
};

export const MOOD_ORDER = ["dawn", "day", "dusk", "night"];

export function moodForHour(hour) {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

// light: "auto" follows the clock; "day" never goes dark; "night" always is.
export function resolveMood(light, date = new Date()) {
  const clock = moodForHour(date.getHours());
  if (light === "night") return "night";
  if (light === "day") return clock === "night" ? "day" : clock;
  return clock;
}

const GREETINGS = {
  dawn: "Good morning. The light is just arriving.",
  day: "Good day. Clear light for focused work.",
  dusk: "Good evening. The light is turning gold.",
  night: "Working late. The studio is quiet.",
};

export const greeting = (mood) => GREETINGS[mood];

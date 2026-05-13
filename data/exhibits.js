window.MUSEUM_CONFIG = {
  player: {
    name: "Visitor",
    image: "",
    start: { x: 112, y: 500 },
    size: { width: 38, height: 54 },
    speed: 235
  },
  welcome: {
    kicker: "Welcome",
    title: "Walk into an exhibit doorway",
    description:
      "Use the arrow keys, WASD, or the movement buttons. Each doorway opens a different educational page while the visitor stays visible on the museum side.",
    facts: [
      "Replace this text in data/exhibits.js to introduce your own museum.",
      "Add images to the assets folder and point the image fields to those files."
    ],
    image: ""
  },
  rooms: [
    {
      id: "history",
      label: "Ancient History",
      color: "#9d3f56",
      doorway: { x: 116, y: 88, width: 178, height: 74 },
      spawn: { x: 156, y: 190 },
      page: {
        kicker: "Exhibit 01",
        title: "Ancient History",
        description:
          "This room can teach visitors about early civilizations, artifacts, writing systems, and how historians interpret evidence from the past.",
        facts: [
          "Artifacts become useful evidence when their location, material, and age are carefully recorded.",
          "Museums often combine objects, maps, and timelines so visitors can connect daily life with major historical events.",
          "You can replace this page with your own lesson, quiz prompt, or story text."
        ],
        image: ""
      }
    },
    {
      id: "science",
      label: "Science Lab",
      color: "#2f6f73",
      doorway: { x: 392, y: 88, width: 178, height: 74 },
      spawn: { x: 432, y: 190 },
      page: {
        kicker: "Exhibit 02",
        title: "Science Lab",
        description:
          "Use this room for concepts such as energy, ecosystems, astronomy, chemistry, or simple experiments that students can try safely.",
        facts: [
          "Good science pages ask visitors to observe, compare, predict, and explain.",
          "Images or diagrams can be placed in assets and connected through the image property.",
          "The same game map can support many subject areas."
        ],
        image: ""
      }
    },
    {
      id: "art",
      label: "Art Gallery",
      color: "#d29a36",
      doorway: { x: 668, y: 88, width: 178, height: 74 },
      spawn: { x: 708, y: 190 },
      page: {
        kicker: "Exhibit 03",
        title: "Art Gallery",
        description:
          "This room can explain visual elements, cultural context, artists, movements, or the techniques behind an artwork.",
        facts: [
          "Invite learners to notice color, line, composition, texture, and mood.",
          "A strong art page can pair one main image with a few focused observation questions.",
          "Change the title, facts, colors, and doorway positions to make a new room."
        ],
        image: ""
      }
    }
  ]
};

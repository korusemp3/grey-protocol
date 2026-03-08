const BLACKFILES_DATA = {
  entities: [
    {
      id: "father-grigory",
      name: "Father Grigory",
      role: "Inquisitor Leader",
      tier: "top",
      status: "active",
      threat: "critical",
      image: "assets/images/entities/father-grigory.jpg",
      summary: "Central ideological leader of the Inquisitor movement. Coordinates high-level anti-cybernetic operations.",
      notes: "Highly influential figure inside multiple radical cells.",
      dossier: "#",
      position: { x: 50, y: 8 }
    },

    {
      id: "ajax",
      name: "Ajax",
      role: "Lieutenant",
      tier: "lieutenant",
      status: "active",
      threat: "high",
      image: "assets/images/entities/ajax.jpg",
      summary: "Field lieutenant responsible for coordinating local strike teams.",
      notes: "Often appears during raids targeting cyberware clinics.",
      dossier: "#",
      position: { x: 28, y: 38 }
    },

    {
      id: "asgard",
      name: "Asgard",
      role: "Lieutenant",
      tier: "lieutenant",
      status: "active",
      threat: "high",
      image: "assets/images/entities/asgard.jpg",
      summary: "Operational commander managing logistics and recruitment.",
      notes: "Connected with several radical anti-cybernetic cells.",
      dossier: "#",
      position: { x: 72, y: 38 }
    }
  ],

  links: [
    {
      from: "father-grigory",
      to: "ajax"
    },
    {
      from: "father-grigory",
      to: "asgard"
    }
  ]
};

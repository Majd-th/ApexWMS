// Represents a playable legend (character) in Apex Legends
export class Legends {
  constructor({ legend_id, name, role, description }) {
    this.legend_id = legend_id;       // (int) Unique ID for each legend
    this.name = name;                 // (string) Legend’s name (e.g., "Wraith", "Bloodhound")
    this.role = role;                 // (string) Legend’s role (Offensive, Defensive, Support, Recon)
    this.description = description;   // (string) Short description of abilities or background
  }
}

/*
Legends form the core of the system and link to their abilities and items.
*/

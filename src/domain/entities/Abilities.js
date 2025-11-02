// The Abilities class represents one ability that belongs to a legend in the game
export class Abilities {
  constructor({ ability_id, legend_id, ability_name, ability_type, description }) {
    this.ability_id = ability_id;        // (int) Unique ID for each ability
    this.legend_id = legend_id;          // (int) Links the ability to a specific legend
    this.ability_name = ability_name;    // (string) Name of the ability (e.g., "Into the Void")
    this.ability_type = ability_type;    // (string) Type of ability: Passive, Tactical, or Ultimate
    this.description = description;      // (string) Text explaining what the ability does
  }
}

/*
Each Legend has 3 abilities: one passive, one tactical, and one ultimate.
This class is used to fetch or display those abilities cleanly in code.
*/

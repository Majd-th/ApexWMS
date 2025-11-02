
// DTO (Data Transfer Object) for Abilities — controls which ability data is sent to the frontend
export class AbilitiesDTO {
  constructor({ ability_id, legend_id, ability_name, ability_type, description }) {
    this.ability_id = ability_id;       // (int) Ability unique ID
    this.legend_id = legend_id;         // (int) Legend linked to this ability
    this.ability_name = ability_name;   // (string) Name of the ability
    this.ability_type = ability_type;   // (string) Passive / Tactical / Ultimate
    this.description = description;     // (string) Description of the ability
  }

  static fromEntity(entity) {
    return new AbilitiesDTO(entity);    // Converts the entity into a DTO for API response
  }
}


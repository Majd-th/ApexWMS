// DTO for Legends — formats legend data to be returned by the API
export class LegendsDTO {
  constructor({ legend_id, name, role, description }) {
    this.legend_id = legend_id;     // (int) Legend ID
    this.name = name;               // (string) Legend name
    this.role = role;               // (string) Legend role (Offense, Support, etc.)
    this.description = description; // (string) Short background or skill summary
  }

  static fromEntity(entity) {
    return new LegendsDTO(entity);
  }
}

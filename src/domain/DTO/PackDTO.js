// DTO for Packs — ensures only necessary pack details are shared
export class PackDTO {
  constructor({ pack_id, pack_name, price, description }) {
    this.pack_id = pack_id;         // (int) Pack ID
    this.pack_name = pack_name;     // (string) Name of the pack
    this.price = price;             // (int) Price in coins
    this.description = description; // (string) What the pack contains / promotional info
  }

  static fromEntity(entity) {
    return new PackDTO(entity);
  }
}

// DTO for UserPacks — represents which packs a user owns
export class UserPacksDTO {
  constructor({ user_pack_id, user_id, pack_id, obtained_at }) {
    this.user_pack_id = user_pack_id; // (int) Record ID for ownership
    this.user_id = user_id;           // (int) ID of the user
    this.pack_id = pack_id;           // (int) ID of the owned pack
    this.obtained_at = obtained_at;   // (timestamp) When the pack was obtained
  }

  static fromEntity(entity) {
    return new UserPacksDTO(entity);
  }
}

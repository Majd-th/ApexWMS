export class UserDTO {
  constructor({ user_id, username, email, coins, created_at }) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
    this.coins = coins;
    this.created_at = created_at;
  }
  static fromEntity(entity) {
    return new UserDTO(entity);
  }
}
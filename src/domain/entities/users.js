export class User {
  constructor({ user_id, username, email, password_hash, coins, created_at }) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.coins = coins || 0;
    this.created_at = created_at;
  }
}

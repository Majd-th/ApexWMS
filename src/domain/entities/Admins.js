// Represents an admin user with privileges to manage the system
export class Admins {
  constructor({ admin_id, username, email, password_hash, created_at }) {
    this.admin_id = admin_id;         // (int) Unique identifier for each admin
    this.username = username;         // (string) Admin’s username (must be unique)
    this.email = email;               // (string) Admin’s email address (must be unique)
    this.password_hash = password_hash; // (string) Encrypted password (for security)
    this.created_at = created_at;     // (timestamp) Date/time when the admin was created
  }
}

/*
Admins manage legends, packs, and items through backend operations.
*/

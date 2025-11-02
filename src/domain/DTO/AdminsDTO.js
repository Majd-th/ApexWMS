// DTO for Admins — used to hide sensitive info like password_hash when sending data
export class AdminsDTO {
  constructor({ admin_id, username, email, created_at }) {
    this.admin_id = admin_id;       // (int) Admin ID
    this.username = username;       // (string) Admin username
    this.email = email;             // (string) Admin email
    this.created_at = created_at;   // (timestamp) Account creation date
  }

  static fromEntity(entity) {
    return new AdminsDTO(entity);
  }
}

/*
🧠 Note:
We intentionally excluded 'password_hash' from this DTO
to protect sensitive data and never expose passwords to the frontend.
*/

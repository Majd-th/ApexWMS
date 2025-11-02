// DTO for UserItems — represents the link between a user and an item they own
export class UserItemsDTO {
  constructor({ user_item_id, user_id, item_id, acquired_at }) {
    this.user_item_id = user_item_id; // (int) Unique record ID
    this.user_id = user_id;           // (int) ID of the user
    this.item_id = item_id;           // (int) ID of the owned item
    this.acquired_at = acquired_at;   // (timestamp) When the user got the item
  }

  static fromEntity(entity) {
    return new UserItemsDTO(entity);
  }
}

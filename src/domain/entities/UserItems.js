
// Represents the link between a user and an item they own
export class UserItems {
  constructor({ user_item_id, user_id, item_id, acquired_at }) {
    this.user_item_id = user_item_id;   // (int) Unique ID for this ownership record
    this.user_id = user_id;             // (int) The ID of the user who owns the item
    this.item_id = item_id;             // (int) The item the user owns
    this.acquired_at = acquired_at;     // (timestamp) Date/time when the user obtained this item
  }
}

/*
Used to build user inventories.
Data is added automatically when packs are opened.
*/

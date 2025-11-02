// Represents which packs a user owns and when they were obtained
export class UserPack {
  constructor({ user_pack_id, user_id, pack_id, obtained_at }) {
    this.user_pack_id = user_pack_id;  // (int) Unique ID for this ownership record
    this.user_id = user_id;            // (int) The ID of the user who owns the pack
    this.pack_id = pack_id;            // (int) The pack the user owns
    this.obtained_at = obtained_at;    // (timestamp) Date/time when the pack was obtained
  }
}

/*
This table connects users to packs and is used to track un-opened packs.
*/

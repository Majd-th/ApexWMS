import { UserRepository } from "../domain/repositories/UserRepository.js";
import { UserDTO } from "../domain/dto/usersDTO.js";
import bcrypt from "bcryptjs";

export class UserService {
  constructor(UserRepository) {
    this.UserRepository = UserRepository;
  }

  // CREATE USER
  async saveUser(userData) {
    let { username, email, password, coins } = userData;

    const hashed = await bcrypt.hash(password, 10);

    // Correct function call → save()
    const user = await this.UserRepository.save(
      username,
      email,
      hashed,
      coins
    );

    return UserDTO.fromEntity(user);
  }

  // READ ALL USERS
  async getUsers() {
    const users = await this.UserRepository.findAll();
    return users.map(u => UserDTO.fromEntity(u));
  }

  // READ ONE
  async getUserById(user_id) {
    const user = await this.UserRepository.findById(user_id);
    return user ? UserDTO.fromEntity(user) : null;
  }

  // UPDATE USER
  async updateUser(user_id, data) {
    const updateData = {
      username: data.username,
      email: data.email,
      coins: data.coins
    };

    // Update password if provided
    if (data.password) {
      updateData.password_hash = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.UserRepository.update(user_id, updateData);
    return updated ? UserDTO.fromEntity(updated) : null;
  }

  // DELETE
  async deleteUser(user_id) {
    return await this.UserRepository.deleteById(user_id);
  }

  // FIND BY USERNAME
  async findByUsername(username) {
    return await this.UserRepository.findByUsername(username);
  }
}

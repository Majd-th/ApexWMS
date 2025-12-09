// Import repository and DTO for Admins
import { AdminsRepository } from "../domain/Repositories/AdminsRepository.js";
import { AdminsDTO } from "../domain/DTO/AdminsDTO.js";
import bcrypt from 'bcryptjs';
// Service class handles all business logic related to admins
export class AdminsService {
  constructor(AdminsRepository) {
    // Inject the AdminsRepository to access database functions
    this.AdminsRepository = AdminsRepository;
  }

  // 🔍 List all admins
  async listAdmins() {
    try {
        // Fetch all admins from repository
        const admins = await this.AdminsRepository.findAll();
        // Convert entities into DTOs for clean responses
        return admins.map(admin => AdminsDTO.fromEntity(admin));
    } catch (error) {
        // Catch and rethrow any DB or validation errors
        throw new Error(`Failed to list admins : ${error.message}`);
    }
  }

 

  // 🟢 Create a new admin
  async createAdmin(data) {
    const { username, email, password } = data;

    // hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.AdminsRepository.save(
      username,
      email,
      hashedPassword
    );

    return admin;
  }

  // 🟡 Update admin info
async updateAdmin(admin_id, data) {
  try {
    if (!admin_id || isNaN(admin_id)) {
      throw new Error("Invalid admin ID");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No data provided for update");
    }

    const updateData = {
      username: data.username,
      email: data.email
    };

    // If password is provided → hash it
    if (data.password) {
      updateData.password_hash = await bcrypt.hash(data.password, 10);
    }

    const updatedAdmin = await this.AdminsRepository.update(admin_id, updateData);

    return updatedAdmin ? AdminsDTO.fromEntity(updatedAdmin) : null;

  } catch (error) {
    throw new Error(`Failed to update admin: ${error.message}`);
  }
}


  // 🔴 Delete an admin by ID
  async deleteAdmin(admin_id) {
    try {
        // Validate input ID
        if (!admin_id || isNaN(admin_id)) throw new Error("Invalid admin ID");

        // Delete record from repository
        const success = await this.AdminsRepository.deleteById(admin_id);
        // Return true if successful
        return success;
    } catch (error) {
        throw new Error(`Failed to delete admin: ${error.message}`);
    }   
  }
   // 🔍 Get a single admin by ID
  async getAdminById(admin_id) {
    try {
        // Validate that the ID is numeric
        if (!admin_id || isNaN(admin_id)) throw new Error("Invalid admin ID");

        // Fetch admin using repository
        const admin = await this.AdminsRepository.findById(admin_id);   

        // Return null if not found
        if (!admin) return null;

        // Return formatted admin DTO
        return AdminsDTO.fromEntity(admin);
    } catch (error) {
        throw new Error(`Failed to get Admin : ${error.message}`);
    }
  }
  async findbyName(username){
    if (!username || isNaN(username)) throw new Error("Invalid admin ID");
    const admin = await this.AdminsRepository.findbyName(username);
    if(!admin) return null;
    return AdminsDTO.fromEntity(admin);
  }
}

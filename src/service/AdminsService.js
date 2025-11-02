// Import repository and DTO for Admins
import { AdminsRepository } from "../domain/Repositories/AdminsRepository.js";
import { AdminsDTO } from "../domain/DTO/AdminsDTO.js";

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
    try {   
        // Validate all required fields
        if (!data || !data.username || !data.email || !data.passwordHash) {
            throw new Error("Missing required fields: username,email,password");
        }

        // Create admin record in database
        const admin = await this.AdminsRepository.save(
            data.username,
            data.email,
            data.passwordHash
        );

        // Return admin DTO
        return AdminsDTO.fromEntity(admin);
    } catch (error) {
        throw new Error(`Failed to create admin: ${error.message}`);
    }
  }

  // 🟡 Update admin info
  async updateAdmin(admin_id, data) {
    try {   
        // Validate ID
        if (!admin_id || isNaN(admin_id)) throw new Error("Invalid admin ID");
        // Ensure update data is provided
        if (!data || Object.keys(data).length === 0) throw new Error("No data provided for update");

        // Call repository update
        const adminn = await this.AdminsRepository.update(admin_id, data);
        // Return DTO or null if not found
        return adminn ? AdminsDTO.fromEntity(adminn) : null;
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

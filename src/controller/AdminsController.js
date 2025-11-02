// Import validationResult from express-validator — used to check if request validation failed
import { validationResult } from "express-validator";

// Controller class handles incoming HTTP requests related to Admins.
// It calls the corresponding methods in the AdminsService and sends appropriate responses.
export class AdminsController {
    constructor(AdminsService) {
        // Inject AdminsService (business logic layer)
        this.AdminsService = AdminsService;
    }

    // 🟢 POST /admins
    // Creates a new admin account
    async createAdmin(req, res) {
        try {
            // Validate incoming request using express-validator
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // If validation fails, send 400 Bad Request with error details
                return res.status(400).json({ errors: errors.array() });
            }

            // Call service to create admin using data from request body
            const admin = await this.AdminsService.createAdmin(req.body);

            // Respond with 201 Created and the newly created admin object
            res.status(201).json(admin);
        } catch (error) {
            // Catch any unexpected errors (e.g. database or logic)
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🔹 GET /admins
    // Lists all admins from the database
    async listAdmins(req, res) {
        try {
            // Call service method to retrieve all admin records
            const admins = await this.AdminsService.listAdmins();

            // Respond with 200 OK and the list of admins
            res.status(200).json(admins);
        } catch (error) {
            // Generic internal error handling
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🟡 PUT /admins/:admin_id
    // Updates an existing admin’s details
    async updateAdmin(req, res) {
        try {
            // Validate request input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Return validation issues if any
                return res.status(400).json({ errors: errors.array() });
            }

            // Call service to update the admin record by ID
            const updatedAdmin = await this.AdminsService.updateAdmin(req.params.admin_id, req.body);

            // If not found, respond with 404 Not Found
            if (!updatedAdmin) {
                return res.status(404).json({ message: "Admin not found" });
            }

            // Respond with updated admin data
            res.status(200).json(updatedAdmin);
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🔴 DELETE /admins/:admin_id
    // Deletes an existing admin record by ID
    async deleteAdmin(req, res) {
        try {
            // Validate route params
            const errors = validationResult(req);   
            if (!errors.isEmpty()) {
                // If validation failed, send 400 Bad Request
                return res.status(400).json({ errors: errors.array() });
            }

            // Call service to delete the admin by ID
            const success = await this.AdminsService.deleteAdmin(req.params.admin_id);

            // If no record deleted, respond with 404 Not Found
            if (!success) {
                return res.status(404).json({ message: "Admin not found" });
            }

            // If success, return success message
            res.status(200).json({ message: "Admin deleted successfully" });
        } catch (error) {
            // Handle server errors
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    // 🔍 GET /admins/:admin_id
    // Retrieves an admin by their unique ID
    async getAdminById(req, res) {
        try {
            // Validate route parameters (admin_id must be a number, etc.)
            const errors = validationResult(req);   
            if (!errors.isEmpty()) {
                // Return validation error if ID is invalid
                return res.status(400).json({ errors: errors.array() });
            }

            // Fetch admin record using the service
            const admin = await this.AdminsService.getAdminById(req.params.admin_id);

            // If no record found, respond with 404 Not Found
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }

            // If found, respond with admin data
            res.status(200).json(admin);
        } catch (error) {
            // Handle any unexpected errors
            res.status(500).json({ error: "Internal Server Error" });
        }       
    }
    async getByname(req,res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({erros:errors.array()});

            }
            const admins = await this.AdminsService.getByname(req.params.username);
            if(!admin)
                return res.status(404).json({message:"admin not found"});
            res.status(200).json(admin);

            }
        catch (error){
            req.status(500).json({error:"internalserver erro"});
        }

    }

}

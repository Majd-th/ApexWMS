
import { UserRepository } from "../domain/Repositories/UserRepository.js";
import { UserDTO } from "../domain/DTO/usersDTO.js";
//import { User } from "../domain/entities/user.js";

export class UserService {
  constructor(UserRepository) {
    this.UserRepository = UserRepository;
  }

  async saveUser(data) {
    try {
      if (!data || !data.username || !data.email || !data.coins) {
        throw new Error("Missing required fields: username,email,coins");
      }
      const user = await this.UserRepository.save(
        data.username,
        data.email,
        data.passwordHash,
        data.coins
      );
      return UserDTO.fromEntity(user);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getUsers() {
    try {
      const users = await this.UserRepository.findAll();
      return users.map(user => UserDTO.fromEntity(user));
    } catch (error) {
      throw new Error(`Failed to list users : ${error.message}`);
    }
  }

  async getUserById(user_id) {
    try {
      if (!user_id || isNaN(user_id)) throw new Error("Invalid user ID");

      const user = await this.UserRepository.findById(user_id);
      if (!user) {
        return null;
      }
      return UserDTO.fromEntity(user);
    } catch (error) {
      throw new Error(`Failed to get User : ${error.message}`);
    }
  }

  async updateUser(user_id, data) {
    try {
      if (!user_id || isNaN(user_id)) {
        throw new Error("Invalid user ID");
      }
      if (!data || Object.keys(data).length === 0) {
        throw new Error("No data provided for update");
      }
      const userr = await this.UserRepository.update(user_id, data);
      return userr ? UserDTO.fromEntity(userr) : null;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(user_id) {
    try {
      if (!user_id || isNaN(user_id)) {
        throw new Error("Invalid user ID");
      }
      return await this.UserRepository.deleteById(user_id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
/*
export class UserService{
    constructor(UserRepository){
    this.UserRepository=UserRepository;
}
async 	saveUser(data) {
    try{
     if (!data || !data.username || !data.email || !data.coins) {
                        throw new Error('Missing required fields: username,email,coins');
                    }
                    const user = await this.UserRepository.save(data);
                    return UserDTO.fromEntity(user);
                } catch (error) {
                    throw new Error(`Failed to create user: ${error.message}`);
                }
            }
            
            


async getUsers(){
      try {
            const users = await this.UserRepository.findAll();
            return users.map(user => UserDTO.fromEntity(user));
        } catch (error) {
            throw new Error(`Failed to list users : ${error.message}`);
        }
    }



async getUserById(id){
    try{
        if(!id || isNaN(id))
            throw new Error('Invalid user ID');

        const user = await this.UserRepository.findById(id);
        if(!user){
            return null;
        }
        return UserDTO.fromEntity(user);
    }catch(error){
        throw new Error(`Failed to get User : ${error.message}`)}
   
        }
    async updateUser(id,data){
        try{
            
            if (!id || isNaN(id)) {
                            throw new Error('Invalid user ID');
                        }
                        if (!data || Object.keys(data).length === 0) {
                            throw new Error('No data provided for update');
                        }
                        const userr = await this.UserRepository.update(id, data);
                        return userr ? UserDTO.fromEntity(userr) : null;
                    } catch (error) {
                        throw new Error(`Failed to update user: ${error.message}`);
                    }

    }
    async deleteUser(id){
        try{
            if(!id || isNaN(id) ){
                throw new Error ('Invalid user ID');
            }
            return await this.UserRepository.deleteById(id);
        }
        catch(error){
                        throw new Error(`Failed to delete user: ${error.message}`);}
    }

    
}
/*/
import {IUser} from "./IUser";
import {RegisterDto} from "../../auth/dto";

export interface IUserRepository {
  /**
   * Finds a user by their ID.
   *
   * @param id - The user's ID.
   * @returns {Promise<IUser | null>} A promise resolving to the user object if found, otherwise null.
   */
  findUserById(id: string): Promise<IUser | null>;

  /**
   * Deletes a user by their ID.
   *
   * @param id - The user's ID.
   * @returns {Promise<IUser>} A promise resolving to the deleted user object.
   */
  deleteUserById(id: string): Promise<IUser>;

  /**
   * Finds a user by their username.
   *
   * @param username - The user's username.
   * @returns {Promise<IUser | null>} A promise resolving to the user object if found, otherwise null.
   */
  getUserByName(username: string): Promise<IUser | null>;

  /**
   * Creates a new user.
   *
   * @param dto - A DTO containing user registration information (e.g., username, password).
   * @param hashedPassword - The user's hashed password.
   * @returns {Promise<IUser>} A promise resolving to the newly created user object.
   */
  createUser(dto: RegisterDto, hashedPassword: string): Promise<IUser>;

  /**
   * Retrieves all users from the system.
   *
   * @returns {Promise<IUser[]>} A promise resolving to an array of user objects.
   */
  getAllUsers(): Promise<IUser[]>;
}
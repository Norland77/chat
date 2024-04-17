import {IUser} from "./IUser";
import {RegisterDto} from "../../auth/dto";

export interface IUserService {
  /**
   * Finds a user by their ID.
   *
   * @param id - The user's ID.
   * @throws {BadRequestException} If the user is not found.
   * @returns {Promise<IUser>} A promise resolving to the user object if found.
   */
  findUserById(id: string): Promise<IUser>;

  /**
   * Deletes a user by their ID.
   *
   * @param id - The user's ID.
   * @returns {Promise<IUser>} A promise resolving to the deleted user object (optional).
   */
  deleteUserById(id: string): Promise<IUser | undefined>;

  /**
   * Finds a user by their username.
   *
   * @param username - The user's username.
   * @throws {BadRequestException} If the user with the specified username is not found.
   * @returns {Promise<IUser>} A promise resolving to the user object if found.
   */
  getUserByName(username: string): Promise<IUser>;

  /**
   * Creates a new user.
   *
   * @param dto - A DTO containing user registration information (e.g., username, password).
   * @throws {BadRequestException} If any validation errors occur during registration.
   * @returns {Promise<IUser>} A promise resolving to the newly created user object.
   */
  createUser(dto: RegisterDto): Promise<IUser>;

  /**
   * Retrieves all users from the system.
   *
   * @throws {BadRequestException} If no users are found.
   * @returns {Promise<IUser[]>} A promise resolving to an array of user objects.
   */
  getAllUsers(): Promise<IUser[]>;
}
import {IUser} from "./IUser";

export interface IUserController {
  /**
   * Retrieves all users from the system.
   *
   * @throws {Exception} - Potential exceptions thrown by the underlying service (implementation-specific).
   * @returns {Promise<IUser[]>} A promise resolving to an array of user objects.
   */
  getAllUsers(): Promise<IUser[]>;

  /**
   * Finds a user by their ID.
   *
   * @param id - The user's ID.
   * @throws {Exception} - Potential exceptions thrown by the underlying service (implementation-specific).
   * @returns {Promise<IUser>} A promise resolving to the user object if found, otherwise throws an exception.
   */
  findUserById(id: string): Promise<IUser>;

  /**
   * Deletes a user by their ID.
   *
   * @param id - The user's ID.
   * @throws {Exception} - Potential exceptions thrown by the underlying service (implementation-specific).
   * @returns {Promise<IUser>} A promise resolving to the deleted user object, or undefined if not found.
   */
  deleteUserById(id: string): Promise<IUser | undefined>;
}
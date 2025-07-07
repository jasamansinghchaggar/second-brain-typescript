import User, { IUser } from "../models/user.model";

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

export const createUser = async (
  email: string,
  password: Promise<string>,
  username: string
): Promise<IUser> => {
  const newUser = new User({ email, password, username });
  return newUser;
};

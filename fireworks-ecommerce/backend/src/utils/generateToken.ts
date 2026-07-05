import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";

export const generateAccessToken = (id: Types.ObjectId | string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || "15m") as SignOptions["expiresIn"],
  };
  return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

export const generateRefreshToken = (id: Types.ObjectId | string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRE || "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, options);
};

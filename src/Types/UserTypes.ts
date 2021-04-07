import Mongoose from "mongoose";

export interface IUser extends Mongoose.Document {
	user: string;
	password: string;
}

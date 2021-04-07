import mongoose from 'mongoose'
import { IUser } from '../Types/UserTypes'


const userSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
		min: 4,
		max: 255,
	},
	password: {
		type: String,
		required: true,
	},
});

export default mongoose.model<IUser>("User", userSchema);

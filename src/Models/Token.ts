import Mongoose from "mongoose";
import { IToken } from '../Types/TokenTypes'

const TokenSchema = new Mongoose.Schema({
	user: {
		type: String,
    },
    refreshToken: {
        type: String
    }
});

export default Mongoose.model<IToken>("Token", TokenSchema);

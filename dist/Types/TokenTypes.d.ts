import Mongoose from "mongoose";
export interface IToken extends Mongoose.Document {
    user: string;
    refreshToken: string;
}

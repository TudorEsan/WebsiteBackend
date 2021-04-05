import mongoose from "mongoose"

export interface ICrypto extends mongoose.Document {
	user: string;
	usdAdded: number;
	ballance: number;
	usdWithdrawn: number;
	coins: [ICoin];
}

export interface CryptoDocument extends ICrypto, mongoose.Document {}

export interface ICoin {
	name: string;
	abbreviation: string;
	icon: string;
	amount: number;
    usd: number;
    sold: number;
    transactions: [ITransaction]
}

export interface ITransaction {
    type: string,
    date: string,
    amount: number,
    usd: number
}
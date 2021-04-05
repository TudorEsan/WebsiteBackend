import mongoose from 'mongoose'
import { CryptoDocument } from '../Types/CryptoTypes';

const TransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    usd: {
        type: Number,
        requried: true
    }
})

const CryptoCoinSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
	abbreviation: {
		type: String,
		require: true,
	},
	icon: {
		type: String,
		require: true,
	},
	amount: {
		type: Number,
		require: true,
	},
	usd: {
		type: Number,
		require: true,
    },
    sold: {
        type: Number,
        default: 0
    },
    transactions: [TransactionSchema]

});


const CryptoScheema = new mongoose.Schema({
	user: {
		type: String,
		default: "",
	},
	usdAdded: {
		type: Number,
		default: 0,
	},
	ballance: {
		type: Number,
		default: 0,
	},
	coins: [CryptoCoinSchema],
	usdWithdrawn: {
		type: Number,
		default: 0,
	},
});

export default mongoose.model<CryptoDocument>("Crypto", CryptoScheema);
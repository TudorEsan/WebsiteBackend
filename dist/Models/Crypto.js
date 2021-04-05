"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionSchema = new mongoose_1.default.Schema({
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
});
const CryptoCoinSchema = new mongoose_1.default.Schema({
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
const CryptoScheema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("Crypto", CryptoScheema);
//# sourceMappingURL=Crypto.js.map
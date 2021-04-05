"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CryptoLogic_1 = __importDefault(require("../Core/CryptoLogic"));
class CryptoRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.get("/", this.getStatistics);
        this.router.post("/addMoney", this.addMoney);
        this.router.post("/withdraw", this.withdraw);
        this.router.post("/", this.buyCrypto);
        this.router.post("/sell", this.sellCrypto);
    }
    getStatistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const statistics = yield CryptoLogic_1.default.getStatistic('tudor');
                return res.status(200).json(statistics);
            }
            catch (er) {
                return res.status(400).json({ message: er.message });
            }
        });
    }
    sellCrypto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, price, amount, abbreviation, date } = req.body;
                yield CryptoLogic_1.default.sell(user, abbreviation, amount, price, date);
                return res.status(200).json({ message: "Coin sold" });
            }
            catch (er) {
                return res.status(400).json({ message: er.message });
            }
        });
    }
    buyCrypto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, usd, amount, abbreviation, date } = req.body;
                yield CryptoLogic_1.default.buy(user, abbreviation, amount, usd, date);
                return res.status(200).json({ message: "Coin bought" });
            }
            catch (er) {
                return res.status(400).json({ message: er.message });
            }
        });
    }
    addMoney(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, usd } = req.body;
                yield CryptoLogic_1.default.addUsd(user, usd);
                return res.status(200).json({ message: `${usd} added!` });
            }
            catch (er) {
                return res.status(400).json({ message: er.message });
            }
        });
    }
    withdraw(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, usd } = req.body;
                yield CryptoLogic_1.default.withdraw(user, usd);
                return res.status(200).json({ message: "Money withdrawn" });
            }
            catch (er) {
                return res.status(400).json({ message: er.message });
            }
        });
    }
}
exports.default = new CryptoRoutes().router;
//# sourceMappingURL=CryptoRoutes.js.map
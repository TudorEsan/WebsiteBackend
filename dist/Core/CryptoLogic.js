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
const Crypto_1 = __importDefault(require("../Models/Crypto"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class CryptoLogic {
    static getIconAndName(abbreviation) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield axios_1.default.get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.CRYPTO_KEY}&ids=${abbreviation}`);
            if (data.data[0] === undefined) {
                return ["", ""];
            }
            return [data.data[0].logo_url, data.data[0].name];
        });
    }
    static getCoinPrice(abbreviation) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield axios_1.default.get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.CRYPTO_KEY}&ids=${abbreviation}`);
            console.log('Price' + data.data[0].price);
            return data.data[0].price;
        });
    }
    static getCurrentPrices(abreviations) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield axios_1.default.get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.CRYPTO_KEY}&ids=${abreviations.join()}`);
            const prices = {};
            data.data.forEach((d) => {
                prices[d.id] = d.price;
            });
            return prices;
        });
    }
    static getGrowth(a, b) {
        return (b * 100) / a - 100;
    }
    static getStatistic(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let actualAmount = 0;
            const statistics = {};
            const doc = yield Crypto_1.default.findOne({ user });
            if (!user) {
                throw Error("User not found!");
            }
            const keys = doc.coins.map((coin) => coin.abbreviation);
            const prices = yield this.getCurrentPrices(keys);
            actualAmount = doc.ballance + doc.usdWithdrawn;
            for (let coin of doc.coins) {
                const currentPrice = prices[coin.abbreviation];
                const currentCoinsUsd = currentPrice * coin.amount;
                actualAmount += currentCoinsUsd;
                statistics[coin.abbreviation] = {
                    growth: this.getGrowth(coin.usd, coin.sold + currentCoinsUsd),
                    currentPrice: currentCoinsUsd,
                    transactions: [coin.transactions],
                };
            }
            statistics.growth = this.getGrowth(doc.usdAdded, actualAmount);
            statistics.actualAmount = actualAmount;
            return statistics;
        });
    }
    static sell(user, abbreviation, amount, price, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield Crypto_1.default.findOne({ user });
            if (!doc)
                throw Error('User not found!');
            const coin = doc.coins.find((c) => c.abbreviation === abbreviation);
            if (!coin)
                throw Error("Coin not found!");
            if (this.hasEnoughMoney(coin.amount, amount)) {
                coin.amount -= amount;
                coin.sold += amount * price;
                coin.transactions.push({
                    type: 'sold',
                    amount,
                    usd: amount * price,
                    date
                });
                doc.ballance += amount * price;
                yield doc.save();
            }
            else {
                throw Error(`Not enough ${coin.abbreviation}!`);
            }
        });
    }
    static buy(user, abbreviation, amount, usd, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield Crypto_1.default.findOne({ user });
            const coin = doc.coins.find((c) => c.abbreviation === abbreviation);
            if (!this.hasEnoughMoney(doc.ballance, usd)) {
                throw Error("Not enough money");
            }
            if (!coin) {
                const [icon, name] = yield this.getIconAndName(abbreviation);
                if (icon === "") {
                    throw Error("Coin dose not exist");
                }
                doc.coins.push({
                    name,
                    icon,
                    abbreviation,
                    amount,
                    usd,
                    sold: 0,
                    transactions: [{ type: "bought", amount, usd, date }],
                });
            }
            else {
                coin.amount += amount;
                coin.usd += usd;
                coin.transactions.push({ type: "bought", amount, usd, date });
            }
            doc.ballance -= usd;
            yield doc.save();
        });
    }
    static addUsd(user, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield Crypto_1.default.findOne({ user });
            if (!doc) {
                throw Error("User not found!");
            }
            doc.ballance += amount;
            doc.usdAdded += amount;
            yield doc.save();
        });
    }
    static withdraw(user, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield Crypto_1.default.findOne({ user });
            if (!doc) {
                throw Error("User not found!");
            }
            if (this.hasEnoughMoney(doc.ballance, amount)) {
                doc.ballance -= amount;
                doc.usdWithdrawn += amount;
            }
            else {
                throw Error("Not enough money");
            }
            yield doc.save();
        });
    }
    static hasEnoughMoney(ballance, amount) {
        return ballance >= amount;
    }
}
exports.default = CryptoLogic;
//# sourceMappingURL=CryptoLogic.js.map
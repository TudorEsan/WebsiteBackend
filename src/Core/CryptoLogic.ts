import Crypto from "../Models/Crypto";
import axios from "axios";
import dotenv from "dotenv";
import { ICoin, ITransaction } from "../Types/CryptoTypes";
dotenv.config();

class CryptoLogic {
	private static async getIconAndName(
		abbreviation: string
	): Promise<[string, string]> {
		const data = await axios.get(
			`https://api.nomics.com/v1/currencies/ticker?key=${process.env.CRYPTO_KEY}&ids=${abbreviation}`
		);
		if (data.data[0] === undefined) {
			return ["", ""];
		}
		return [data.data[0].logo_url, data.data[0].name];
	}

	private static async getCoinPrice(abbreviation: string): Promise<number> {
		const data = await axios.get(
			`https://api.nomics.com/v1/currencies/ticker?key=${process.env.CRYPTO_KEY}&ids=${abbreviation}`
		);
		console.log("Price" + data.data[0].price);
		return data.data[0].price;
	}

	private static async getCurrentPrices(abreviations: string[]) {
		const data = await axios.get(
			`https://api.nomics.com/v1/currencies/ticker?key=${
				process.env.CRYPTO_KEY
			}&ids=${abreviations.join()}`
		);
		const prices = {} as any;
		data.data.forEach((d: any) => {
			prices[d.id] = d.price;
		});
		return prices;
	}

	private static getGrowth(a: number, b: number) {
		return (b * 100) / a - 100;
	}

	static async getStatistic(user: string) {
		let actualAmount = 0;
		const statistics = {
			coins: [] as {
				abbreviation: string;
				icon: string;
				currentPrice: number;
				growth: number;
				transactions: ITransaction[];
			}[],
			growth: 0,
			actualAmount: 0,
		};
		const doc = await Crypto.findOne({ user });
		if (!user) {
			throw Error("User not found!");
		}
		const keys = doc.coins.map((coin) => coin.abbreviation as string);
		const prices = await this.getCurrentPrices(keys);
		actualAmount = doc.ballance + doc.usdWithdrawn;
		for (let coin of doc.coins) {
			const currentPrice = prices[coin.abbreviation];
			const currentCoinsUsd = currentPrice * coin.amount;
			actualAmount += currentCoinsUsd;
			statistics.coins.push({
				abbreviation: coin.abbreviation,
				icon: coin.icon,
				growth: this.getGrowth(coin.usd, coin.sold + currentCoinsUsd),
				currentPrice: currentCoinsUsd,
				transactions: coin.transactions,
			});
		}
		statistics.coins = statistics.coins.sort((a, b) => b.currentPrice - a.currentPrice);
		statistics.growth = this.getGrowth(doc.usdAdded, actualAmount);
		statistics.actualAmount = actualAmount;
		return statistics;
	}

	static async sell(
		user: string,
		abbreviation: string,
		amount: number,
		price: number,
		date: string
	) {
		const doc = await Crypto.findOne({ user });
		if (!doc) throw Error("User not found!");
		const coin = doc.coins.find((c) => c.abbreviation === abbreviation);
		if (!coin) throw Error("Coin not found!");
		if (this.hasEnoughMoney(coin.amount, amount)) {
			coin.amount -= amount;
			coin.sold += amount * price;
			coin.transactions.push({
				type: "sold",
				amount,
				usd: amount * price,
				date,
			});
			doc.ballance += amount * price;
			await doc.save();
		} else {
			throw Error(`Not enough ${coin.abbreviation}!`);
		}
	}
	static async buy(
		user: string,
		abbreviation: string,
		amount: number,
		usd: number,
		date: string
	) {
		const doc = await Crypto.findOne({ user });
		const coin = doc.coins.find((c) => c.abbreviation === abbreviation);
		if (!this.hasEnoughMoney(doc.ballance, usd)) {
			throw Error("Not enough money");
		}
		if (!coin) {
			const [icon, name] = await this.getIconAndName(abbreviation);
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
		} else {
			coin.amount += amount;
			coin.usd += usd;
			coin.transactions.push({ type: "bought", amount, usd, date });
		}
		doc.ballance -= usd;
		await doc.save();
	}

	static async addUsd(user: string, amount: number) {
		const doc = await Crypto.findOne({ user });
		if (!doc) {
			throw Error("User not found!");
		}
		doc.ballance += amount;
		doc.usdAdded += amount;
		await doc.save();
	}
	static async withdraw(user: string, amount: number) {
		const doc = await Crypto.findOne({ user });
		if (!doc) {
			throw Error("User not found!");
		}
		if (this.hasEnoughMoney(doc.ballance, amount)) {
			doc.ballance -= amount;
			doc.usdWithdrawn += amount;
		} else {
			throw Error("Not enough money");
		}
		await doc.save();
	}

	private static hasEnoughMoney(ballance: number, amount: number) {
		return ballance >= amount;
	}
}

export default CryptoLogic;

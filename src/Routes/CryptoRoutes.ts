import e from "express";
import express from "express";
import CryptoLogic from "../Core/CryptoLogic";
import Crypto from "../Models/Crypto";

class CryptoRoutes {
	router: express.Router;

	constructor() {
		this.router = express.Router();
		this.configureRoutes();
	}

	private configureRoutes() {
		this.router.get("/", this.getStatistics);
		this.router.post("/addMoney", this.addMoney);
		this.router.post("/withdraw", this.withdraw);
        this.router.post("/", this.buyCrypto);
        this.router.post("/sell", this.sellCrypto);
	}

	private async getStatistics(req: express.Request, res: express.Response) {
		try {
			const statistics = await CryptoLogic.getStatistic('tudor');
			return res.status(200).json(statistics);
		} catch (er) {
			return res.status(400).json({ message: er.message });
		}
	}

	private async sellCrypto(req: express.Request, res: express.Response) {
		try {
			const { user, price, amount, abbreviation, date } = req.body as {
				user: string;
				price: number;
				amount: number;
				abbreviation: string;
				date: string;
			};
			await CryptoLogic.sell(user, abbreviation, amount, price, date);
			return res.status(200).json({ message: "Coin sold" });
		} catch (er) {
			return res.status(400).json({ message: er.message });
		}
	}

	private async buyCrypto(req: express.Request, res: express.Response) {
		try {
			const { user, usd, amount, abbreviation, date } = req.body as {
				user: string;
				usd: number;
				amount: number;
				abbreviation: string;
				date: string;
			};
			await CryptoLogic.buy(user, abbreviation, amount, usd, date);
			return res.status(200).json({ message: "Coin bought" });
		} catch (er) {
			return res.status(400).json({ message: er.message });
		}
	}

	private async addMoney(req: express.Request, res: express.Response) {
		try {
			const { user, usd } = req.body as {
				user: string;
				usd: number;
			};
			await CryptoLogic.addUsd(user, usd);
			return res.status(200).json({ message: `${usd} added!` });
		} catch (er) {
			return res.status(400).json({ message: er.message });
		}
	}

	private async withdraw(req: express.Request, res: express.Response) {
		try {
			const { user, usd } = req.body as {
				user: string;
				usd: number;
			};
			await CryptoLogic.withdraw(user, usd);
			return res.status(200).json({ message: "Money withdrawn" });
		} catch (er) {
			return res.status(400).json({ message: er.message });
		}
	}
}

export default new CryptoRoutes().router;

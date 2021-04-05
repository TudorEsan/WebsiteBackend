import express from "express";
import cors from "cors";
import MailRoutes from "./Routes/MailRoutes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Crypto from "./Models/Crypto";
import CryptoRoutes from "./Routes/CryptoRoutes";
dotenv.config();

class App {
	constructor() {
		this.app = express();
		this.config();
		this.conectToDb();
		this.routes();
	}

	public app: express.Application;

	private async conectToDb() {
		await mongoose.connect(
			process.env.DB_CONNECTION,
			{
				useNewUrlParser: true,
				poolSize: 10,
				useUnifiedTopology: true,
			},
			(err) => {
				if (err) console.log(err);
			}
		);
	}

	private config() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private routes() {
		this.app.use("/mail", MailRoutes);
		this.app.use("/crypto", CryptoRoutes);
	}
}

export default new App().app;

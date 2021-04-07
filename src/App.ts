import express from "express";
import cors from "cors";
import MailRoutes from "./Routes/MailRoutes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Crypto from "./Models/Crypto";
import CryptoRoutes from "./Routes/CryptoRoutes";
import { verifyAuth } from "./Middlewares/authVerification";
import AuthRoutes from "./Routes/AuthRoutes";
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
		//this.app.use('/', verifyAuth);
	}

	private routes() {
		this.app.use("/mail", MailRoutes);
		this.app.use("/crypto", CryptoRoutes);
		this.app.use("/auth", AuthRoutes);
		this.app.get('', verifyAuth, (req, res) => {
			res.send('Oosjdfojsfoij')
		})
	}
}

export default new App().app;

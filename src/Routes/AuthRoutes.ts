import express from "express";
import User from "../Models/User";
import bcrypt from "bcryptjs";
import UserLogic from "../Core/UserLogic";

class AuthRoutes {
	router: express.Router;

	constructor() {
		this.router = express.Router();
		this.configureRoutes();
	}

	private configureRoutes() {
		this.router.post('/register', this.register);
		this.router.post('/login', this.login);
	}

	private async login(req: express.Request, res: express.Response) {
		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res
				.status(401)
				.json({ message: "Email or Password is wrong" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res
				.status(401)
				.json({ message: "Username or Password is wrong" });

		try {
			const [
				token,
				refreshToken,
			] = await UserLogic.generateTokenAndRefreshToken(req.body.user);
			return res
				.status(200)
				.header("Authorization", token + " " + refreshToken)
				.json({ user: user._id });
		} catch (e) {
			return res.status(400).json({ message: e.message });
		}
	}

	private async register(req: express.Request, res: express.Response) {
		const user = await User.findOne({ email: req.body.user as string });
		if (user)
			return res.status(400).json({ message: "User already exists" });
		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const newUser = new User({
				user: req.body.user,
				password: hashedPassword,
			});
			await newUser.save();
			const [
				token,
				refreshToken,
			] = await UserLogic.generateTokenAndRefreshToken(req.body.user);
			console.log(token, refreshToken, "\n\n\n\n\n");
			return res
				.status(200)
				.header("Authorization", token + " " + refreshToken)
				.json({ id: newUser._id });
		} catch (e) {
			return res.status(400).json({ message: e.message });
		}
	}
}

export default new AuthRoutes().router
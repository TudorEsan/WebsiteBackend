import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Token from '../Models/Token'

class UserLogic {
	static generateRefreshToken = async (user: string) => {
		const random = crypto.randomBytes(36).toString();
		const refreshToken = await bcrypt.hash(random, 10);
		const token = await Token.findOne({ user: user });
		if (token) {
			token.refreshToken = refreshToken;
			await token.save();
		} else {
			const newToken = new Token({
				user: user,
				refreshToken: refreshToken,
			});
			await newToken.save();
		}
		return refreshToken;
	};

	static validateRefreshToken = async (
		user: string,
		refreshToken: string
	) => {
		const token = await Token.findOne({
			user: user,
			refreshToken: refreshToken,
		});
		return !!token;
	};

	static generateToken = async (user: string) =>
		jwt.sign({ user: user }, process.env.TOKEN_SECRET, {
			expiresIn: "1m",
		});

	static generateTokenAndRefreshToken = async (user: string) => {
		const token = await UserLogic.generateToken(user);
		const refreshToken = await UserLogic.generateRefreshToken(user);
		return [token, refreshToken];
	};

	static regenerateRefreshToken = async (
		user: string,
		refreshToken: string
	) => {
		const isValid = await UserLogic.validateRefreshToken(
			user,
			refreshToken
		);
		if (!isValid) {
			throw new Error("401");
		}
		return await UserLogic.generateRefreshToken(user);
	};

	static regenerateTokenAndRefreshToken = async (
		user: string,
		refreshToken: string
	) => [
		await UserLogic.generateToken(user),
		await UserLogic.regenerateRefreshToken(user, refreshToken),
	];
}

export default UserLogic;

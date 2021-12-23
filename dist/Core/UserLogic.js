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
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Token_1 = __importDefault(require("../Models/Token"));
class UserLogic {
}
UserLogic.generateRefreshToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const random = crypto_1.default.randomBytes(36).toString();
    const refreshToken = yield bcryptjs_1.default.hash(random, 10);
    const token = yield Token_1.default.findOne({ user: user });
    if (token) {
        token.refreshToken = refreshToken;
        yield token.save();
    }
    else {
        const newToken = new Token_1.default({
            user: user,
            refreshToken: refreshToken,
        });
        yield newToken.save();
    }
    return refreshToken;
});
UserLogic.validateRefreshToken = (user, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield Token_1.default.findOne({
        user: user,
        refreshToken: refreshToken,
    });
    return !!token;
});
UserLogic.generateToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign({ user: user }, process.env.TOKEN_SECRET, {
        expiresIn: "1m",
    });
});
UserLogic.generateTokenAndRefreshToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield UserLogic.generateToken(user);
    const refreshToken = yield UserLogic.generateRefreshToken(user);
    return [token, refreshToken];
});
UserLogic.regenerateRefreshToken = (user, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isValid = yield UserLogic.validateRefreshToken(user, refreshToken);
    if (!isValid) {
        throw new Error("401");
    }
    return yield UserLogic.generateRefreshToken(user);
});
UserLogic.regenerateTokenAndRefreshToken = (user, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return [
        yield UserLogic.generateToken(user),
        yield UserLogic.regenerateRefreshToken(user, refreshToken),
    ];
});
exports.default = UserLogic;
//# sourceMappingURL=UserLogic.js.map
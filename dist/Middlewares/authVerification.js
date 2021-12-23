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
exports.verifyAuth = void 0;
const jwt = require("jsonwebtoken");
const UserLogic_1 = __importDefault(require("../Core/UserLogic"));
const verifyAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorizaton = req.header("Authorization");
    if (!authorizaton) {
        return res.status(401).json({ message: "Tokens required!" });
    }
    const [token, refreshToken] = authorizaton.split(" ");
    try {
        if (!token)
            return res.status(404).json({ message: "Access Denied!" });
        const verifyToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (verifyToken) {
            const [newToken, newRefreshToken,] = yield UserLogic_1.default.regenerateTokenAndRefreshToken(req.body.user, refreshToken);
            res.header("Authorization", newToken + " " + newRefreshToken);
            next();
        }
    }
    catch (e) {
        console.log(e);
        if (e.name === "TokenExpiredError") {
            console.log('token expirat');
            try {
                const [newToken, newRefreshToken,] = yield UserLogic_1.default.regenerateTokenAndRefreshToken(req.body.user, refreshToken);
                console.log('A trecut ');
                res.header("Authorization", newToken + " " + newRefreshToken);
                next();
            }
            catch (e) {
                if (e.message === "401") {
                    return res.status(401).json("Unauthorized");
                }
                else {
                    return res.status(400).json({ message: e.message });
                }
            }
            if (!refreshToken) {
                return res
                    .status(404)
                    .json({ message: "Refresh Token missing" });
            }
        }
        else {
            return res.status(400).json({ message: e.message });
        }
    }
});
exports.verifyAuth = verifyAuth;
//# sourceMappingURL=authVerification.js.map
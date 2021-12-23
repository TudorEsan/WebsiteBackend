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
const User_1 = __importDefault(require("../Models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserLogic_1 = __importDefault(require("../Core/UserLogic"));
class AuthRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email: req.body.email });
            if (!user)
                return res
                    .status(401)
                    .json({ message: "Email or Password is wrong" });
            const validPassword = yield bcryptjs_1.default.compare(req.body.password, user.password);
            if (!validPassword)
                return res
                    .status(401)
                    .json({ message: "Username or Password is wrong" });
            try {
                const [token, refreshToken,] = yield UserLogic_1.default.generateTokenAndRefreshToken(req.body.user);
                return res
                    .status(200)
                    .header("Authorization", token + " " + refreshToken)
                    .json({ user: user._id });
            }
            catch (e) {
                return res.status(400).json({ message: e.message });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email: req.body.user });
            if (user)
                return res.status(400).json({ message: "User already exists" });
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
                const newUser = new User_1.default({
                    user: req.body.user,
                    password: hashedPassword,
                });
                yield newUser.save();
                const [token, refreshToken,] = yield UserLogic_1.default.generateTokenAndRefreshToken(req.body.user);
                console.log(token, refreshToken, "\n\n\n\n\n");
                return res
                    .status(200)
                    .header("Authorization", token + " " + refreshToken)
                    .json({ id: newUser._id });
            }
            catch (e) {
                return res.status(400).json({ message: e.message });
            }
        });
    }
}
exports.default = new AuthRoutes().router;
//# sourceMappingURL=AuthRoutes.js.map
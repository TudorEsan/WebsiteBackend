declare class UserLogic {
    static generateRefreshToken: (user: string) => Promise<string>;
    static validateRefreshToken: (user: string, refreshToken: string) => Promise<boolean>;
    static generateToken: (user: string) => Promise<string>;
    static generateTokenAndRefreshToken: (user: string) => Promise<string[]>;
    static regenerateRefreshToken: (user: string, refreshToken: string) => Promise<string>;
    static regenerateTokenAndRefreshToken: (user: string, refreshToken: string) => Promise<string[]>;
}
export default UserLogic;

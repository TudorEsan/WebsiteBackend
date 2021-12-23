import { ITransaction } from "../Types/CryptoTypes";
declare class CryptoLogic {
    private static getIconAndName;
    private static getCurrentPrices;
    private static getGrowth;
    static getStatistic(user: string): Promise<{
        coins: {
            abbreviation: string;
            icon: string;
            currentPrice: number;
            growth: number;
            transactions: ITransaction[];
        }[];
        growth: number;
        actualAmount: number;
        usdGrowth: number;
        ballance: number;
    }>;
    static sell(user: string, abbreviation: string, amount: number, price: number, date: string): Promise<void>;
    static buy(user: string, abbreviation: string, amount: number, usd: number, date: string): Promise<void>;
    static addUsd(user: string, amount: number): Promise<void>;
    static withdraw(user: string, amount: number): Promise<void>;
    private static hasEnoughMoney;
}
export default CryptoLogic;

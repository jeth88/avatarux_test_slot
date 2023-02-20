interface IPayoutsData {
    symbolName: string;
    pays: number[];
    description?: string;
}
export declare class PaytablePayouts {
    static readonly PAYOUTS: IPayoutsData[];
}
export {};

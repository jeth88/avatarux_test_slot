import * as PIXI from "pixi.js";
export interface ISymbolWinData {
    symbol: PIXI.Sprite;
    reelIdx: number;
    rowIdx: number;
}
export declare class WinFeature {
    private _symbolData;
    private _allSymbolWins;
    private _allSymbolWinsData;
    private _reelsContainer;
    set reelsContainer(value: PIXI.Container[]);
    private populateFirstReel;
    private initializeFirstReel;
    private getUniqueSymbolNamesFromFirstReel;
    private populateSucceedingReels;
    private cleanupSymbolsAndWins;
    private getSymbolData;
    private getValidWaysAndProductValue;
    private resetAllSymbolWins;
    getWinData(): {
        allSymbolWins: PIXI.Sprite[];
        sum: string;
        allSymbolWinsData: ISymbolWinData[];
    };
}

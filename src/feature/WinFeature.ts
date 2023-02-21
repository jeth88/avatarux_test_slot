import * as PIXI from "pixi.js";
import { GameController } from "./../controller/GameController";
import { PaytablePayouts } from "./../data/PaytablePayouts";

interface ISymbolData {
    symbol: PIXI.Sprite,
    count?: number,
    occurrencesPerReel?: number[]
}

export interface ISymbolWinData {
    symbol: PIXI.Sprite,
    reelIdx: number,
    rowIdx: number
}

export class WinFeature {
    private _symbolData: ISymbolData[];
    private _allSymbolWins: PIXI.Sprite[];
    private _allSymbolWinsData: ISymbolWinData[];

    private _reelsContainer: PIXI.Container[];
    public set reelsContainer(value: PIXI.Container[]) {
        this._reelsContainer = value;
    }

    private populateFirstReel(reelContainer: PIXI.Container, reelIdx: number): void {
        this.initializeFirstReel(reelContainer);

        let uniqueArrayNames = this.getUniqueSymbolNamesFromFirstReel(reelContainer);
        let namesLen = uniqueArrayNames.length;

        while (namesLen--) {
            let symbolsFound = this._symbolData.filter((element) => {
                return element.symbol.name === uniqueArrayNames[namesLen];
            })

            if (symbolsFound.length) {
                let isChanged = false;
                let symbolLen = this._symbolData.length;

                while (symbolLen--) {
                    if (this._symbolData[symbolLen].symbol.name === uniqueArrayNames[namesLen]) {
                        if (!isChanged) {
                            isChanged = true;
                            this._symbolData[symbolLen].occurrencesPerReel = [0, 0, 0, 0, 0];
                            this._symbolData[symbolLen].occurrencesPerReel[reelIdx] = symbolsFound.length;
                        }
                        else {
                            this._symbolData.splice(symbolLen, 1);
                        }
                    }
                }
            }
        }
    }

    private initializeFirstReel(reelContainer: PIXI.Container): void {
        for (let idx in reelContainer.children) {
            const symbol = reelContainer.getChildAt(parseInt(idx)) as PIXI.Sprite;

            this._symbolData.push({
                symbol: symbol,
                count: 1,
            });
            this._allSymbolWins.push(symbol);
            this._allSymbolWinsData.push({
                symbol: symbol,
                reelIdx: 0,
                rowIdx: parseInt(idx)
            });
        }
    }

    private getUniqueSymbolNamesFromFirstReel(reelContainer: PIXI.Container): string[] {
        let names = reelContainer.children.map((sym) => {
            return sym.name;
        });

        let uniqueSetNames = new Set(names);
        let uniqueArrayNames: string[] = [];
        uniqueSetNames.forEach(value => uniqueArrayNames.push(value));

        return uniqueArrayNames;
    }

    private populateSucceedingReels(reelContainer: PIXI.Container, reelIdx: number): void {
        let symbolLen = this._symbolData.length;

        while (symbolLen--) {
            let symbolsFound = reelContainer.children.filter((element) => {
                return element.name === this._symbolData[symbolLen].symbol.name;
            })

            if (symbolsFound.length) {
                let isChanged = false;
                let reelChildrenLen = reelContainer.children.length;

                while (reelChildrenLen--) {
                    if (this._symbolData[symbolLen].symbol.name === reelContainer.getChildAt(reelChildrenLen).name && this._symbolData[symbolLen].occurrencesPerReel[reelIdx - 1]) {
                        this._allSymbolWins.push(reelContainer.getChildAt(reelChildrenLen) as PIXI.Sprite);

                        this._allSymbolWinsData.push({
                            symbol: reelContainer.getChildAt(reelChildrenLen) as PIXI.Sprite,
                            reelIdx: reelIdx,
                            rowIdx: reelChildrenLen
                        });

                        if (!isChanged) {
                            isChanged = true;
                            this._symbolData[symbolLen].count++;
                            this._symbolData[symbolLen].occurrencesPerReel[reelIdx] = symbolsFound.length;
                        }
                    }
                }
            }

            this.cleanupSymbolsAndWins(symbolLen, reelIdx);
        }
    }

    private cleanupSymbolsAndWins(symbolLen: number, reelIdx: number): void {
        if (this._symbolData[symbolLen].count < 3 &&
            (this._symbolData[symbolLen].count === 1 && reelIdx === 1) ||
            (this._symbolData[symbolLen].count === 2 && reelIdx === 2)
        ) {
            const deletedElement = this._symbolData.splice(symbolLen, 1);

            this._allSymbolWins = this._allSymbolWins.filter((symbol) => {
                return deletedElement[0].symbol.name !== symbol.name;
            });

            this._allSymbolWinsData = this._allSymbolWinsData.filter((element) => {
                return deletedElement[0].symbol.name !== element.symbol.name;
            });
        }
    }

    private getSymbolData(): void {
        this._symbolData = [];
        this._allSymbolWins = [];
        this._allSymbolWinsData = [];

        this._reelsContainer.forEach((reelContainer, reelIdx) => {
            reelIdx === 0
                ? this.populateFirstReel(reelContainer, reelIdx)
                : this.populateSucceedingReels(reelContainer, reelIdx);
        });

        if (GameController.IS_DEBUG) {
            console.log("");
            console.log("Variable [this._symbolData]:", this._symbolData);
            console.log("Variable [this._allSymbolWins]:", this._allSymbolWins);
        }
    }

    private getValidWaysAndProductValue(winData: ISymbolData): { validWays: number[], productValue: number } {
        const occurrencesPerReel = winData.occurrencesPerReel;
        if (GameController.IS_DEBUG) {
            console.log("");
            console.log("Occurrences per reel:", occurrencesPerReel);
        }

        const validWays = occurrencesPerReel.filter((occurrencePerReel) => {
            return occurrencePerReel > 0;
        });

        const productValue = validWays.reduce((previousValue, currentValue) => {
            return previousValue * currentValue;
        });

        return {
            validWays: validWays,
            productValue: productValue
        };
    }

    private resetAllSymbolWins(): void {
        this._allSymbolWins = [];
        this._allSymbolWins.length = 0;

        this._allSymbolWinsData = [];
        this._allSymbolWinsData.length = 0;
    }

    public getWinData(): { allSymbolWins: PIXI.Sprite[], sum: string, allSymbolWinsData: ISymbolWinData[] } {
        let sum = 0;
        this.getSymbolData();

        this._symbolData.forEach((winData) => {
            const symbolName = winData.symbol.name;
            const { validWays, productValue } = this.getValidWaysAndProductValue(winData);

            for (let i = 0, payoutLen = PaytablePayouts.PAYOUTS.length; i < payoutLen; i++) {
                const payout = PaytablePayouts.PAYOUTS[i];
                if (symbolName === payout.symbolName) {
                    if (GameController.IS_DEBUG) {
                        console.log("Symbol name:", symbolName);
                        console.log("Description:", payout.description);
                        console.log(`x${validWays.length}: ${payout.pays[validWays.length - 1]}`);
                        console.log("Number of ways per symbol:", productValue);
                        console.log("Total value per symbol:", payout.pays[validWays.length - 1] * productValue);
                    }

                    sum += payout.pays[validWays.length - 1] * productValue;
                    break;
                }
            }
        });

        !sum
            ? this.resetAllSymbolWins()
            : GameController.IS_DEBUG && console.log("Total win amount:", sum);

        return {
            allSymbolWins: this._allSymbolWins,
            sum: sum.toString(),
            allSymbolWinsData: this._allSymbolWinsData
        }
    }
}
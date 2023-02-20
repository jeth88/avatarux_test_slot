import * as PIXI from "pixi.js";
export declare class WinLabelView {
    private _app;
    private _winLabelContainer;
    private _winLabelText;
    constructor(app: PIXI.Application);
    private initializeWinLabel;
    setWinLabel(amountStr?: string): void;
    repositionAndScaleLabel(scaleFactor: number): void;
}

import * as PIXI from "pixi.js";
export declare class GameView {
    static readonly REELS: number;
    static readonly ROWS: number;
    private _winLabelView;
    private _reelsView;
    private _buttonView;
    constructor(app: PIXI.Application);
    repositionGameElements(scaleFactor: number): void;
}

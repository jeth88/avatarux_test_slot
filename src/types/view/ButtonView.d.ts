import * as PIXI from "pixi.js";
import { ReelsView } from "./ReelsView";
export declare class ButtonView {
    private readonly SPIN_DISABLED_DURATION;
    private _reelsView;
    private _buttonsContainer;
    private _app;
    set app(value: PIXI.Application);
    constructor(reelsView: ReelsView);
    private _texturesPromise;
    private preloadAssets;
    private createSpinButton;
    private createSoundToggleButton;
    repositionAndScaleButton(scaleFactor: number): void;
}

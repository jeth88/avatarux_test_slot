import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { Howl } from 'howler';
import * as PIXI from "pixi.js";
import { ButtonView } from "./ButtonView";
import { ReelsView } from "./ReelsView";
import { WinLabelView } from './WinLabelView';

export class GameView {
    public static readonly REELS: number = 5;
    public static readonly ROWS: number = 3;

    private _winLabelView: WinLabelView;
    private _reelsView: ReelsView;
    private _buttonView: ButtonView;

    constructor(app: PIXI.Application) {
        gsap.registerPlugin(PixiPlugin)
        PixiPlugin.registerPIXI(PIXI)

        const backgroundSnd = new Howl({
            src: ["./../sound/background.mp3"],
            loop: true,
        });
        backgroundSnd.play();

        this._winLabelView = new WinLabelView(app);

        this._reelsView = new ReelsView(this._winLabelView);
        this._reelsView.app = app;

        this._buttonView = new ButtonView(this._reelsView);
        this._buttonView.app = app;
    }

    public repositionGameElements(scaleFactor: number): void {
        this._winLabelView.repositionAndScaleLabel(scaleFactor);
        this._reelsView.repositionAndScaleReels(scaleFactor);
        this._buttonView.repositionAndScaleButton(scaleFactor);
    }
}
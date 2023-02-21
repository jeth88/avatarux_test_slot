import { gsap } from 'gsap';
import { Howl } from "howler";
import * as PIXI from "pixi.js";
import { GameController } from "./../controller/GameController";
import { HelperUtil } from "./../util/HelperUtil";

export class WinLabelView {
    private _app: PIXI.Application;
    private _winSnd: Howl;
    private _winLabelContainer: PIXI.Container;
    private _winLabelText: PIXI.Text;

    constructor(app: PIXI.Application) {
        this._app = app;
        this._winSnd = new Howl({
            src: ["./sound/win.wav"]
        });
        this._winLabelContainer = new PIXI.Container();

        this.initializeWinLabel();
    }

    private initializeWinLabel(): void {
        this._winLabelText = HelperUtil.createDynamicText({
            text: 'WIN: 0',
            fontFamily: ['Verdana', 'Geneva', 'Tahoma', 'sans-serif'],
            fontSize: 28,
            align: 'center',
            color: '0xe5af32',
            positionX: -190,
            positionY: GameController.GAME_HEIGHT - 150,
            anchorX: 0.5,
        });

        this._winLabelContainer.addChild(this._winLabelText);
        this._app.stage.addChild(this._winLabelContainer);
    }

    public setWinLabel(amountStr: string = '0'): void {
        this._winLabelText.text = `WIN: ${amountStr}`;

        if (amountStr !== '0') {
            this._winSnd.play();
            gsap.to(this._winLabelText.scale, {
                x: 1.2,
                y: 1.2,
                duration: 0.15,
                repeat: 1,
                yoyo: true,
            });
        }
    }

    public repositionAndScaleLabel(scaleFactor: number): void {
        this._winLabelContainer.scale.set(scaleFactor);
        this._winLabelContainer.x = this._app.screen.width / 2;
    }
}
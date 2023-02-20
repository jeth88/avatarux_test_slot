import * as PIXI from "pixi.js";
import { GameController } from "./../controller/GameController";
import { ReelsView } from "./ReelsView";

export class ButtonView {
    private readonly SPIN_DISABLED_DURATION: number = 1350;

    private _reelsView: ReelsView;
    private _buttonsContainer: PIXI.Container;

    private _app: PIXI.Application;
    public set app(value: PIXI.Application) {
        this._app = value;
    }

    constructor(reelsView: ReelsView) {
        this._reelsView = reelsView;
        this._buttonsContainer = new PIXI.Container();

        this.preloadAssets();
    }

    private _texturesPromise: any;

    private async preloadAssets(): Promise<void> {
        const buttonKeys = ["spin", "soundOn", "soundOff"];
        const buttonPaths = ["./../img/Spin.png", "./../img/sound_on.png", "./../img/sound_off.png"];

        for (const idx in buttonKeys) {
            PIXI.Assets.add(buttonKeys[idx], buttonPaths[idx])
        }

        this._texturesPromise = await PIXI.Assets.load(buttonKeys);

        this.createSpinButton();
        this.createSoundToggleButton();
    }

    private createSpinButton(): void {
        const spinButton = PIXI.Sprite.from(this._texturesPromise["spin"]);
        spinButton.scale.set(0.4);
        spinButton.anchor.set(0.5);
        spinButton.y = GameController.GAME_HEIGHT - (spinButton.height + 40);

        spinButton.interactive = true;
        spinButton.cursor = "pointer";

        spinButton.on('pointerup', () => {
            spinButton.interactive = false;
            spinButton.tint = 0x808080;
            setTimeout(() => {
                spinButton.interactive = true; spinButton.tint = 0xFFFFFF;
                this._reelsView.checkWinnings();
            }, this.SPIN_DISABLED_DURATION);

            this._reelsView.generateNewSymbols();
        });

        this._buttonsContainer.addChild(spinButton);
        this._app.stage.addChild(this._buttonsContainer);
    }

    private createSoundToggleButton(): void {
        let isOn = true;
        const soundOnTexture = PIXI.Texture.from(this._texturesPromise["soundOn"].baseTexture.resource.src);
        const soundOffTexture = PIXI.Texture.from(this._texturesPromise["soundOff"].baseTexture.resource.src);

        const soundButton = new PIXI.Sprite(soundOnTexture);
        soundButton.scale.set(0.5);
        soundButton.anchor.set(0.5);
        soundButton.x = 240;
        soundButton.y = GameController.GAME_HEIGHT - 80;

        soundButton.interactive = true;
        soundButton.cursor = "pointer";

        soundButton.on('pointerup', () => {
            isOn = !isOn;

            if (isOn) {
                Howler.volume(1);
                soundButton.texture = soundOnTexture;
            }
            else {
                Howler.volume(0);
                soundButton.texture = soundOffTexture;
            }
        });

        this._buttonsContainer.addChild(soundButton);
    }

    public repositionAndScaleButton(scaleFactor: number): void {
        this._buttonsContainer.scale.set(scaleFactor);
        this._buttonsContainer.x = this._app.screen.width / 2;
    }
}
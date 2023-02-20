import * as PIXI from 'pixi.js';
import { GameView } from './../view/GameView';

export class GameController {
    public static readonly GAME_WIDTH: number = 800;
    public static readonly GAME_HEIGHT: number = 600;
    public static readonly IS_DEBUG: boolean = false;

    private _app: PIXI.Application;
    private _view: GameView;

    constructor() {
        this._app = new PIXI.Application({
            width: GameController.GAME_WIDTH,
            height: GameController.GAME_HEIGHT,
            background: "#0f4a6c"
        });

        this._view = new GameView(this._app);
        document.getElementById("gameContainer").appendChild(this._app.view as any);

        window.addEventListener('resize', () => {
            this.scaleGameElements();
        });
        window.addEventListener('orientationchange', () => {
            this.scaleGameElements();
        });

        this.scaleGameElements();
    }

    private scaleGameElements(): void {
        const scaleFactor = Math.min(
            window.innerWidth / GameController.GAME_WIDTH,
            window.innerHeight / GameController.GAME_HEIGHT
        );
        const newWidth = Math.ceil(GameController.GAME_WIDTH * scaleFactor);
        const newHeight = Math.ceil(GameController.GAME_HEIGHT * scaleFactor);

        this._app.renderer.view.style.width = `${newWidth}px`;
        this._app.renderer.view.style.height = `${newHeight}px`;
        this._app.renderer.resize(newWidth, newHeight);

        this._view.repositionGameElements(scaleFactor);
    }
}
import * as PIXI from 'pixi.js';
import { ITextData } from './../interface/ITextData';

export class HelperUtil {
  public static createDynamicText(textData: ITextData): PIXI.Text {
    const dynamicText = new PIXI.Text(textData.text, {
      fontFamily: textData.fontFamily,
      fontSize: textData.fontSize,
      align: textData.align,
      fill: textData.color,
    })
    dynamicText.anchor.x = textData.anchorX || 0;
    dynamicText.x = textData.positionX;
    dynamicText.y = textData.positionY;

    return dynamicText;
  }
}

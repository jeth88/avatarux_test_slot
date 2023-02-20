import * as PIXI from 'pixi.js'

export interface ITextData {
  text: string
  fontFamily?: string[]
  fontSize?: number
  align?: PIXI.TextStyleAlign
  color?: any
  anchorX?: number
  positionX?: number
  positionY?: number
}

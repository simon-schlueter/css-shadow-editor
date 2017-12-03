export interface IRgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface IShadowEffect {
  inset: boolean;
  color: IRgbaColor;
  xOffset: number;
  yOffset: number;
  blur: number;
  spread: number;
  name: string;
  visible: boolean;
}

import { IShadowEffect } from "../interfaces";
import * as parseColor from "parse-color";

export function getBoxShadowString(effect: IShadowEffect): string {
  let str = `${effect.xOffset}px `;
  str += `${effect.yOffset}px `;

  if (effect.blur !== 0 && effect.spread !== null) {
    str += `${effect.blur}px `;

    if (effect.spread !== 0) {
      str += `${effect.spread}px `;
    }
  }

  if (effect.color.a !== 1) {
    str += `rgba(${effect.color.r}, ${effect.color.g}, ${effect.color.b}, ${effect.color.a})`;
  } else {
    str += `rgb(${effect.color.r}, ${effect.color.g}, ${effect.color.b})`;
  }

  str += effect.inset ? " inset" : "";

  return str;
}

export function getTextShadowString(effect: IShadowEffect): string {
  let str = `${effect.xOffset}px `;
  str += `${effect.yOffset}px `;

  if (effect.blur !== 0) {
    str += `${effect.blur}px `;
  }

  if (effect.color.a !== 1) {
    str += `rgba(${effect.color.r}, ${effect.color.g}, ${effect.color.b}, ${effect.color.a})`;
  } else {
    str += `rgb(${effect.color.r}, ${effect.color.g}, ${effect.color.b})`;
  }

  str += effect.inset ? " inset" : "";

  return str;
}

export function parseBoxShadowString(str: string): IShadowEffect[] {
  const effects: IShadowEffect[] = [];
  const regex = /(-?[0-9]+)px (-?[0-9]+)px(?: ([0-9]+)px)?(?: (-?[0-9]+)px)? (#[a-z0-9]+|[a-z]{3,}\(\d{1,3}, \d{1,3}, \d{1,3}(?:, [0-9\.]+)?\))( inset)?/gi;
  let match: RegExpMatchArray;
  let id: number = 0;

  while (match = regex.exec(str)) {
    ++id;

    const color = parseColor(match[5]);

    effects.push({
      xOffset: parseInt(match[1], 10),
      yOffset: parseInt(match[2], 10),
      blur: match[3] != null ? parseInt(match[3], 10) : 0,
      spread: match[4] != null ? parseInt(match[4], 10) : 0,
      color: { r: color.rgba[0], g: color.rgba[1], b: color.rgba[2], a: color.rgba[3] },
      inset: match[6] != null,
      name: `Layer ${id}`,
      visible: true
    });
  }

  if (effects.length === 0) {
    return null;
  }

  return effects;
}

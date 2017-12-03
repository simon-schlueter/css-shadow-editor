declare module "parse-color" {
  namespace parse {
    interface ParseResult {
      rgb: [0, 0, 0],
      hsl: [0, 0, 0],
      hsv: [0, 0, 0],
      cmyk: [0, 0, 0, 0],
      keyword: string,
      hex: string,
      rgba: [0, 0, 0, 0],
      hsla: [0, 0, 0, 0],
      hsva: [0, 0, 0, 0],
      cmyka: [0, 0, 0, 0, 0],
    }
  }

  function parse(str: string): parse.ParseResult;

  export = parse;
}

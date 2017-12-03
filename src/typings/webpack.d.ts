declare module "*.css" {
  const value: any;
  export = value;
}

declare module "*.png" {
  const value: string;
  export = value;
}

declare var process: {
  env: {
    NODE_ENV: "production" | "development";
  }
}

declare function require(file: string): any;

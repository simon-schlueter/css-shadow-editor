declare module "copy-to-clipboard" {
  namespace copy {
    interface CopyOptions {
      debug?: boolean;
      message?: string;
    }
  }

  function copy(text: string, options?: copy.CopyOptions): void;

  export = copy;
}

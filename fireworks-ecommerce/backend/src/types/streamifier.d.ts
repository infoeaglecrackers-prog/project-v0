declare module "streamifier" {
  import { Readable } from "stream";
  function createReadStream(buffer: Buffer | string, options?: object): Readable;
  export { createReadStream };
  export default { createReadStream };
}

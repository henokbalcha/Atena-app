declare module 'apkreader' {
    export default class ApkReader {
        static open(buffer: Buffer): Promise<ApkReader>;
        readManifest(): Promise<any>;
        readResources(): Promise<any>;
    }
}

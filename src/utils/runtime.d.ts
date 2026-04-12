// Type declarations for globals provided by the chayns-codes runtime.

declare const process: { env: Record<string, string | undefined> };

declare namespace chayns {
  namespace storage {
    function get(key: string): Promise<unknown>;
    function set(key: string, value: unknown): Promise<void>;
    function remove(key: string): Promise<void>;
  }
}

declare module '@chayns-codes/http' {
  export class Api {
    get(path: string, handler: unknown): this;
    post(path: string, handler: unknown): this;
    put(path: string, handler: unknown): this;
    patch(path: string, handler: unknown): this;
    delete(path: string, handler: unknown): this;
    build(): unknown;
  }
}

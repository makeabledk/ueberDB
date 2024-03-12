import AbstractDatabase, { Settings } from '../lib/AbstractDatabase';
export default class RealtimeDB extends AbstractDatabase {
    _data: any;
    private app;
    private firebaseInitialized;
    constructor(settings: Settings);
    get isAsync(): boolean;
    close(): void;
    findKeys(key: string, notKey: string): Promise<string[]>;
    get(key: string): Promise<any>;
    init(): void;
    remove(key: string): Promise<void>;
    set(key: string, value: any): Promise<void>;
    initFirebase(): Promise<void>;
    mapKeysToRealtimeKeys(keys: any): any;
    mapRealtimeKeysToKeys(keys: any): any;
}
//# sourceMappingURL=realtime_db.d.ts.map
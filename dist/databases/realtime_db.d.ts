import AbstractDatabase, { Settings } from '../lib/AbstractDatabase';
export default class RealtimeDB extends AbstractDatabase {
    _data: any;
    private database;
    private app;
    constructor(settings: Settings);
    get isAsync(): boolean;
    close(): void;
    findKeys(key: string, notKey: string): Promise<never[]>;
    get(key: string): Promise<any>;
    init(): void;
    remove(key: string): Promise<boolean>;
    set(key: string, value: string): Promise<void>;
    initFirebase(): Promise<void>;
}
//# sourceMappingURL=realtime_db.d.ts.map
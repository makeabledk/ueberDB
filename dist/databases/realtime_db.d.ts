import AbstractDatabase, { Settings } from '../lib/AbstractDatabase';
export default class RealtimeDB extends AbstractDatabase {
    _data: any;
    private database;
    constructor(settings: Settings);
    get isAsync(): boolean;
    close(): void;
    findKeys(key: string, notKey: string): any[];
    get(key: string): Promise<any>;
    init(): void;
    remove(key: string): Promise<void>;
    set(key: string, value: string): Promise<void>;
}
//# sourceMappingURL=realtime_db.d.ts.map
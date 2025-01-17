import { BulkObject } from "./cassandra_db";
import AbstractDatabase, { Settings } from "../lib/AbstractDatabase";
export default class SQLiteDB extends AbstractDatabase {
    db: any | null;
    constructor(settings: Settings);
    init(callback: Function): void;
    _query(sql: string, params?: never[]): Promise<any>;
    get(key: string, callback: Function): void;
    findKeys(key: string, notKey: string, callback: Function): void;
    set(key: string, value: string, callback: Function): void;
    remove(key: string, callback: Function): void;
    handleBulk(bulk: BulkObject): string;
    doBulk(bulk: BulkObject[], callback: Function): void;
    close(callback: Function): void;
}
//# sourceMappingURL=sqlite_db.d.ts.map
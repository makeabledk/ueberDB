/**
 * 2012 Max 'Azul' Wiehle
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference types="node" />
import AbstractDatabase, { Settings } from '../lib/AbstractDatabase';
import { Agent } from 'http';
import nano from 'nano';
import { BulkObject } from './cassandra_db';
export default class Couch_db extends AbstractDatabase {
    agent: Agent | null;
    db: nano.DocumentScope<string> | null;
    constructor(settings: Settings);
    get isAsync(): boolean;
    init(): Promise<void>;
    get(key: string): Promise<null | string>;
    findKeys(key: string, notKey: string): Promise<string[] | undefined>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
    doBulk(bulk: BulkObject[]): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=couch_db.d.ts.map
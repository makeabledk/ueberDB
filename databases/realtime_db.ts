import AbstractDatabase, {Settings} from '../lib/AbstractDatabase';
import { getDatabase, set, ref, get, child,remove } from "firebase/database";
import { initializeApp } from "firebase/app";

export default class RealtimeDB extends AbstractDatabase {
  public _data: any;
  private database: any;
  private app: any;

  constructor(settings:Settings) {
    super(settings);
    this.settings = settings;
    settings.json = false;
    settings.cache = 0;
    settings.writeInterval = 0;
    this._data = null;
    this.app = this.initFirebase();
  }

  get isAsync() { return true; }

  close() {
    this._data = null;
  }

  findKeys(key:string, notKey:string) {
    const regex = this.createFindRegex(key, notKey);
    return [...this._data.keys()].filter((k) => regex.test(k));
  }

  async get(key:string) {
    const result = await get(child(ref(this.database), `${this.settings.table ?? 'pads'}/${key}`));
    return result.val();
  }

  init() {}

  async remove(key:string) {
    return remove(ref(this.database, `${this.settings.table ?? 'pads'}/${key}`));
  }

  async set(key:string, value:string) {
    return set(ref(this.database, `${this.settings.table ?? 'pads'}/${key}`), value);
  }

  async initFirebase() {
    this.app = initializeApp({
      apiKey: this.settings.clientOptions.apiKey,
      authDomain: this.settings.clientOptions.authDomain,
      databaseURL: this.settings.clientOptions.databaseURL,
      projectId: this.settings.clientOptions.projectId,
      storageBucket: this.settings.clientOptions.storageBucket,
      messagingSenderId: this.settings.clientOptions.messagingSenderId,
      appId: this.settings.clientOptions.appId,
      measurementId: this.settings.clientOptions.measurementId
    });
    this.database = getDatabase(this.app);
  }
};

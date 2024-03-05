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

  async findKeys(key:string, notKey:string) {
    console.log('findKeys', key, notKey);
    const docRef = await get(child(ref(this.database), `${this.settings.table ?? 'pads'}`));
    const keys = docRef.val();
    const regex = this.createFindRegex(key, notKey);
    console.log('findKeys', regex, keys, Object.keys(keys).filter((k) => regex.test(k)));
    return Object.keys(keys).filter((k) => regex.test(k));
  }

  async get(key:string) {
    console.log('get', key);
    const result = await get(child(ref(this.database), `${this.settings.table ?? 'pads'}/${key}`));
    console.log('get', result.val());
    return result.val();
  }

  init() {}

  async remove(key:string) {
    console.log('remove', key);
    await remove(ref(this.database, `${this.settings.table ?? 'pads'}/${key}`));
    console.log('remove', true);
    return true;
  }

  async set(key:string, value:string) {
    console.log('set', key, value);
    await set(ref(this.database, `${this.settings.table ?? 'pads'}/${key}`), value);
    console.log('set', true);
  }

  async initFirebase() {
    console.log('initFirebase', this.settings.clientOptions);
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
    console.log('initFirebase done');
    this.database = getDatabase(this.app);
    console.log('initFirebase database done');
  }
};

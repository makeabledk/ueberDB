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
    this.app = null;
  }

  get isAsync() { return true; }

  close() {
    this._data = null;
  }

  async findKeys(key:string, notKey:string) {
    try{
      await this.initFirebase();
      console.log('findKeys', key, notKey);
      const docRef = child(ref(getDatabase()), `${this.settings.table ?? 'pads'}`);
      console.log('docRef', docRef);
      const values = await get(docRef);
      const keys = values.val();
      const regex = this.createFindRegex(key, notKey);
      console.log('findKeys', regex, keys, Object.keys(keys).filter((k) => regex.test(k)));
      return Object.keys(keys).filter((k) => regex.test(k));
    }catch(e){
      console.log('findKeys', e);
    }
    return [];
  }

  async get(key:string) {
    await this.initFirebase();
    console.log('get', key);
    const result = await get(child(ref(getDatabase()), `${this.settings.table ?? 'pads'}/${key}`));
    console.log('get', result.val());
    return result.val();
  }

  init() {}

  async remove(key:string) {
    await this.initFirebase();
    console.log('remove', key);
    await remove(ref(getDatabase(), `${this.settings.table ?? 'pads'}/${key}`));
    console.log('remove', true);
    return true;
  }

  async set(key:string, value:string) {
    await this.initFirebase();
    console.log('set', key, value);
    await set(ref(getDatabase(), `${this.settings.table ?? 'pads'}/${key}`), value);
    console.log('set', true);
  }

  async initFirebase() {
    if (!this.app) {
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
    }
  }
};

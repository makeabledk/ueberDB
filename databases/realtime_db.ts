import AbstractDatabase, {Settings} from '../lib/AbstractDatabase';
import admin from "firebase-admin";

export default class RealtimeDB extends AbstractDatabase {
  public _data: any;
  private app: any;
  private firebaseInitialized = false;

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
      await this.initFirebase();
      const db = admin.database()
      console.log('findKeys', key, notKey);
      const ret = await db.ref(`${this.settings.table ?? 'pads'}`).once("value")
      console.log('findKeys', ret.val());
      const keys = ret.val();
      const regex = this.createFindRegex(key, notKey);
      return Object.keys(keys).filter((k) => regex.test(k));
  }

  async get(key:string) {
    await this.initFirebase();
    console.log('get', key);
    const result = await admin.database().ref(`${this.settings.table ?? 'pads'}/${key}`).once("value");
    console.log('get', result.val());
    return result.val();
  }

  init() {}

  async remove(key:string) {
    await this.initFirebase();
    console.log('remove', key);
    await admin.database().ref(`${this.settings.table ?? 'pads'}/${key}`).remove();
    console.log('remove', true);
    return true;
  }

  async set(key:string, value:string) {
    await this.initFirebase();
    console.log('set', key, value);
    await admin.database().ref(`${this.settings.table ?? 'pads'}/${key}`).set(value);
    console.log('set', true);
  }

  async initFirebase() {
    if (!this.firebaseInitialized) {
      console.log('initFirebase', this.settings.clientOptions);
      this.firebaseInitialized = true;
      const app = admin.initializeApp(this.settings.clientOptions);
      console.log('initFirebase done');
    }
  }
};

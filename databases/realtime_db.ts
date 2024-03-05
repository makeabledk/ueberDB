import AbstractDatabase, {Settings} from '../lib/AbstractDatabase';
import admin from "firebase-admin";

export default class RealtimeDB extends AbstractDatabase {
  public _data: any;
  private app: any;
  private firebaseInitialized = false;

  constructor(settings:Settings) {
    super(settings);
    this.settings = settings;
    this.settings.table = settings.table ?? 'pads';
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
      const ret = await db.ref(`${this.settings.table}`).once("value")
      const keys = ret.val();
      const regex = this.createFindRegex(key, notKey);
      return Object.keys(keys ?? {}).filter((k) => regex.test(k));
  }

  async get(key:string) {
    await this.initFirebase();
    const result = await admin.database().ref(`${this.settings.table}/${key.replace(/[\.]/g,'::')}`).once("value");
    let value = result.val();
    if(value?.meta?.pool?.attribubToNum){
      value.meta.pool.attribubToNum = Object.fromEntries(Object.entries(value.meta.pool.attribubToNum).map(([k,v])=>[k.replace(/::/g,'.'),v]) as any)
    }
    return value;
  }

  init() {}

  async remove(key:string) {
    await this.initFirebase();
    await admin.database().ref(`${this.settings.table}/${key.replace(/[\.]/g,'::')}`).remove();
  }

  async set(key:string, value:any) {
    if(value?.meta?.pool?.attribubToNum){
      value.meta.pool.attribubToNum = Object.fromEntries(Object.entries(value.meta.pool.attribubToNum).map(([k,v])=>[k.replace(/[\.]/g,'::'),v]) as any)
    }
    await this.initFirebase();
    await admin.database().ref(`${this.settings.table}/${key.replace(/[\.]/g,'::')}`).set(value);
  }

  async initFirebase() {
    if (!this.firebaseInitialized) {
      this.firebaseInitialized = true;
      this.app = admin.initializeApp(this.settings.clientOptions);
    }
  }
};

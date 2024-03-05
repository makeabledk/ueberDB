import AbstractDatabase, {Settings} from '../lib/AbstractDatabase';
import { getDatabase as getRealtimeDatabase, set as firebaseSet, ref as firebaseRef, get as firebaseGet, child,remove } from "firebase/database";
import { initializeApp, setLogLevel } from "firebase/app";

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
    const tmp = child(firebaseRef(getRealtimeDatabase()), `padsTable`);
    firebaseGet(tmp).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val(),'here');
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });


    try{
      await this.initFirebase();
      console.log('findKeys', key, notKey);
      const docRef = child(firebaseRef(getRealtimeDatabase()), `${this.settings.table ?? 'pads'}`);
      
      console.log('docRef', docRef);
      const values = await firebaseGet(docRef);
      console.log('values', values.val());
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
    const result = await firebaseGet(child(firebaseRef(getRealtimeDatabase()), `${this.settings.table ?? 'pads'}/${key}`));
    console.log('get', result.val());
    return result.val();
  }

  init() {}

  async remove(key:string) {
    await this.initFirebase();
    console.log('remove', key);
    await remove(firebaseRef(getRealtimeDatabase(), `${this.settings.table ?? 'pads'}/${key}`));
    console.log('remove', true);
    return true;
  }

  async set(key:string, value:string) {
    await this.initFirebase();
    console.log('set', key, value);
    await firebaseSet(firebaseRef(getRealtimeDatabase(), `${this.settings.table ?? 'pads'}/${key}`), value);
    console.log('set', true);
  }

  async initFirebase() {
    if (!this.firebaseInitialized) {
      console.log('initFirebase', this.settings.clientOptions);
      setLogLevel('debug');
      this.firebaseInitialized = true;
      const app = initializeApp({
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

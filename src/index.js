import { initializeApp } from 'firebase/app';
import * as auth from 'firebase/auth';
import * as  database from 'firebase/database';

import repl from "repl";

import { startBoil, setTemp, commands } from './commands.js';
import { getJobIndex } from './job-util.js';
// }
var config = {
  apiKey: "AIzaSyD0IOPaFj2zkMs5_rStrSRQ-m02bLwj88c",
  authDomain: "smarter-live.firebaseapp.com",
  databaseURL: "https://smarter-live.firebaseio.com",
  projectId: "smarter-live",
  storageBucket: "smarter-live.appspot.com",
  messagingSenderId: "41919779740"
};

const print = (promise) => {
  const index = getJobIndex();
  promise
    .then((val) => {
      console.log(`[${index}]`, JSON.stringify(val.val(), null, 2));
    })
    .catch((err) => {
      console.error(`[${index}]`, err);
    });
  console.log(`[${index}]`, 'pending');
};

async function run() {

  var app = initializeApp(config);
  const subscriptions = [];


  const db = database.getDatabase()

  var replServer = repl.start({
    prompt: "firebase> ",
  });

  const cmd = (fn) => (data) => fn(db, replServer.context.data.user, data);
  // apply `cmd` to the value of each key in cmdObj and return a new object
  const cmds = (cmdObj) => Object.entries(cmdObj).reduce((acc, [key, fn]) => {
    acc[key] = cmd(fn);
    return acc;
  }, {});

  Object.assign(replServer.context, {
    firebase: {
      auth,
      database
    },
    app,
    db,
    data: {},
    print,
    unsubscribe: (index) => {
      subscriptions[index]();
      console.log('unsubscribed');
    },
    get: (path) => {
      return print(database.get(database.ref(db, path)));
    },
    push: (path, value) => {
      return print(sendCommand(db, path, value));
    },
    commands: cmds(commands)
  })

  const user = await auth.signInWithEmailAndPassword(auth.getAuth(), 'username', 'password');;
  replServer.context.data.user = user;
  const userInfo = (await database.get(database.ref(db, 'users/' + user.user.uid))).val();
  replServer.context.data.userInfo = userInfo;
  replServer.context.data.network = (await database.get(database.ref(db, 'networks/' + Object.keys(userInfo.networks_index)[0]))).val();

  const [subscriptionIdx, statusSubscription] = await watchKettle(db, user);
  subscriptions[subscriptionIdx] = statusSubscription;

}


run()


export async function watchKettle(db) {
  const index = getJobIndex();
  const kettleRef = database.ref(db, 'devices/30000c2a690fcb36/status');
  const unsubscribe = database.onValue(kettleRef, (status) => {
    console.log('kettle status', status.val());
  });

  return [index, unsubscribe];
}




/*
{
  "t": "d",
  "d": {
    "a": "p",  // push
    "r": 9, 
    "b": {
      "p": "devices\/30000c2a690fcb36\/commands\/start_boil\/-NqZdjVGy14B-eW-6CWh\/value",
      "d": {
        "user_id": "IF8ugOCh4Ze681yZbtt7E2eJwwx2",
        "value": true
      }
    }
  }


  ----
#
- {"t":"d","d":{"b":{"p":"
devices/30000c2a690fcb36/status","d":{"boiling_started":{"heating":true,"temperature":27.251434,"ts":1707864422}}},"a":"m"}}
- 

}

*/
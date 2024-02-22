import { getJobIndex } from "./job-util.js";
import * as  database  from 'firebase/database';

export async function startBoil(db, user, value) {
  return sendCommand(db, 'start_boil', {
    user_id: user.user.uid,
    value
  });
}

export async function setTemp(db, user, temp) {
  return sendCommand(db, 'set_boil_temperature', {
    user_id: user.user.uid,
    value: temp
  });
}

async function sendCommand(db, command, data) {
  const newCommandRef = database.child(database.ref(db), 'devices/30000c2a690fcb36/commands/' + command);
  const newCommandKeyR = database.push(newCommandRef, data);

  const r = await newCommandKeyR;
  // const r = await ref. push(db, );
  // console.log(r);
  return r;
}

export async function setFormulaModeEnable(db, value) {
  return sendCommand(db, 'set_formula_mode_enable', {
    user_id: user.user.uid,
    value
  });
}

export function addAlarm(db, value) {
  return sendCommand(db, 'add_alarm', {
    user_id: user.user.uid,
    value
  });
}

export function changeAlarm(db, value) {
  return sendCommand(db, 'change_alarm', {
    user_id: user.user.uid,
    value
  });
}

export function removeAlarm(db, value) {
  return sendCommand(db, 'remove_alarm', {
    user_id: user.user.uid,
    value
  });
}

export function setFormulaModeTemperature(db, value) {
  return sendCommand(db, 'set_formula_mode_temperature', {
    user_id: user.user.uid,
    value
  });
}

export function setKeepWarmTime(db, value) {
  return sendCommand(db, 'set_keep_warm_time', {
    user_id: user.user.uid,
    value
  });
}

export function setManualBoilTemperature(db, value) {
  return sendCommand(db, 'set_manual_boil_temperature', {
    user_id: user.user.uid,
    value
  });
}

export function setManualFormulaModeEnable(db, value) {
  return sendCommand(db, 'set_manual_formula_mode_enable', {
    user_id: user.user.uid,
    value
  });
}

export function setManualFormulaModeTemperature(db, value) {
  return sendCommand(db, 'set_manual_formula_mode_temperature', {
    user_id: user.user.uid,
    value
  });
}

export function setManualKeepWarmTime(db, value) {
  return sendCommand(db, 'set_manual_keep_warm_time', {
    user_id: user.user.uid,
    value
  });
}

export function setOptions(db, value) {
  return sendCommand(db, 'set_options', {
    user_id: user.user.uid,
    value
  });
}

export function startAutoBoil(db, value) {
  return sendCommand(db, 'start_auto_boil', {
    user_id: user.user.uid,
    value
  });
}

export function stopBoil(db, value) {
  return sendCommand(db, 'stop_boil', {
    user_id: user.user.uid,
    value
  });
}


export const commands = {
  boil: startBoil,
  setTemp,
  setFormulaMode: setFormulaModeEnable,

};

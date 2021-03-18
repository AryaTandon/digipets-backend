require("dotenv").config(); 
if (!process.env.DATABASE_URL) {
  throw "You're missing the DATABASE_URL env variable!"
}

const { Client, Pool } = require('pg')
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}); 
client.connect();

/**
 * The core Digipet functions.
 *
 * These are encapsulated over in controller.ts
 */

export interface Digipet {
  happiness: number;
  nutrition: number;
  discipline: number;
}

const initialDigipet: Digipet = {
  happiness: 50,
  nutrition: 50,
  discipline: 50,
};
/**
 * The default state of a new digipet.
 * Frozen to prevent accidental mutations.
 */
export const INITIAL_DIGIPET = Object.freeze(initialDigipet);

/**
 * The user's digipet (if they have one).
 *
 * Avoid directly manipulating this - you should access it through the getter (getDigipet) and update it through the setter (setDigipet).
 *
 * (This is encapsulation: https://refactoring.guru/encapsulate-field)
 *
 * The variable is exported purely to _test_ `setDigipet`.
 */
export let _userDigipet: Digipet | undefined;
export let _userDigipet2: Digipet | undefined;

/**
 * Get the data for the user digipet (if it exists) - but not the underlying object reference (to protect the data from accidental changes)
 */
export function getDigipet() {
//   const id = 1;
//   console.log("eek");
//   getDB(id);
//   sleep(1000);
//   return _userDigipet
//  // spread to create a shallow copy to avoid mutation
//   // return _userDigipet ? { ..._userDigipet } : undefined;
}

// function sleep(milliseconds: number) {
//   const date = Date.now();
//   let currentDate = null;
//   do {
//     currentDate = Date.now();
//   } while (currentDate - date < milliseconds);
// }


export function getDigipet2() {
//   const id = 2;
//   console.log("eek")
//   getDB(id);
//   sleep(1000);
//   return _userDigipet2
//   // const digipet = async () => await getDB(id)
//   // let hi;
//   // return digipet().then(res => hi = res)
//   // digipet().then(res => hi = res)
//   // while (true) {
//   //   if (typeof(hi) === "object") 
//   //     return hi
//   // }
//   // spread to create a shallow copy to avoid mutation
//   // return _userDigipet2 ? { ..._userDigipet2 } : undefined;
}

/**
 * Set the user's digipet to a new object (or `undefined`)
 *
 * @param newDigipet The new digipet data; pass `undefined` to effectively remove the digipet
 */
export async function setDigipet(newDigipet: Digipet): Promise<void> {
  const id = 1;
  await setDB(newDigipet, id)
  // spread to avoid mutation
  // _userDigipet = newDigipet ? { ...newDigipet } : undefined;
}

export async function setDigipet2(_userDigipet: Digipet): Promise<void> {
  const id = 2;
  await setDB(_userDigipet, id)
  // spread to avoid mutation
  // _userDigipet2 = _userDigipet ? { ..._userDigipet } : undefined;
}

// async/await - check out a client
export const getDB = async (id: number): Promise <Digipet | undefined> => {
  const values = [id];
  try {
    const digipetQuery = {
      text: 'SELECT discipline, happiness, nutrition FROM stats ' +
      'WHERE id = $1;',
      values,
      rowMode: 'array',
    }
    let res = await client.query(digipetQuery) 
    res ? console.log(res.rows[0][0]) : console.log("noooo...");
    let digipetStats: Digipet = { 
      discipline: res.rows[0][0],
      happiness: res.rows[0][1],
      nutrition: res.rows[0][2]
    }
     if (id === 1) {
       _userDigipet = digipetStats;
       return _userDigipet
     } else {
       _userDigipet2 = digipetStats;
       return _userDigipet2
     }
    } catch (err) {
      console.log("okay...")
      return undefined;
    }
}

// async/await - check out a client
const setDB = async ({discipline, happiness, nutrition}: Digipet, id: number) => {
  const values = [discipline, happiness, nutrition, id];
  try {
    await client.query('INSERT INTO stats (discipline, happiness, nutrition, id) ' +
    'VALUES ($1, $2, $3, $4);', values)
    console.log("Hi3")
  } catch (err) {
    await client.query('UPDATE stats ' +
    'SET discipline = $1, ' +
    'happiness = $2, ' +
    'nutrition = $3 ' +
    'WHERE id = $4;', values)
    console.log("Hi2")
  }
}

// async/await - check out a client
export const delDB = async (id: number) => {
  const values = [id];
  try {
    await client.query('DELETE FROM stats ' +
    'WHERE id = $1;', values)
  } catch (err) {
    console.log(err.stack)
  }
}

/**
 * Makes a bounded update to the user's digipet - increases and decreases up to a maximum of 100 and a minimum of 0
 *
 * @param digipetKey the digipet measure to update
 * @param netUpdate the intended change - e.g. `12` to increase by 12, `-4` to decrease by 4
 */
export async function updateDigipetBounded(
  digipetKey: keyof Digipet,
  netUpdate: number
): Promise<void> {
  const digipetData = await getDB(1); // is a shallow copy
  if (digipetData) {
    const valueToBound = digipetData[digipetKey] + netUpdate;
    if (valueToBound > 100) {
      digipetData[digipetKey] = 100;
    } else if (valueToBound < 0) {
      digipetData[digipetKey] = 0;
    } else {
      digipetData[digipetKey] = valueToBound;
    }
    // shallow copy has updated values to set
    await setDigipet(digipetData);
  }
}

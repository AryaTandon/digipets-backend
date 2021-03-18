"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDigipetBounded = exports.delDB = exports.getDB = exports.setDigipet2 = exports.setDigipet = exports.getDigipet2 = exports.getDigipet = exports._userDigipet2 = exports._userDigipet = exports.INITIAL_DIGIPET = void 0;
require("dotenv").config();
if (!process.env.DATABASE_URL) {
    throw "You're missing the DATABASE_URL env variable!";
}
const { Client, Pool } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
client.connect();
const initialDigipet = {
    happiness: 50,
    nutrition: 50,
    discipline: 50,
};
/**
 * The default state of a new digipet.
 * Frozen to prevent accidental mutations.
 */
exports.INITIAL_DIGIPET = Object.freeze(initialDigipet);
/**
 * Get the data for the user digipet (if it exists) - but not the underlying object reference (to protect the data from accidental changes)
 */
function getDigipet() {
    //   const id = 1;
    //   console.log("eek");
    //   getDB(id);
    //   sleep(1000);
    //   return _userDigipet
    //  // spread to create a shallow copy to avoid mutation
    //   // return _userDigipet ? { ..._userDigipet } : undefined;
}
exports.getDigipet = getDigipet;
// function sleep(milliseconds: number) {
//   const date = Date.now();
//   let currentDate = null;
//   do {
//     currentDate = Date.now();
//   } while (currentDate - date < milliseconds);
// }
function getDigipet2() {
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
exports.getDigipet2 = getDigipet2;
/**
 * Set the user's digipet to a new object (or `undefined`)
 *
 * @param newDigipet The new digipet data; pass `undefined` to effectively remove the digipet
 */
function setDigipet(newDigipet) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = 1;
        yield setDB(newDigipet, id);
        // spread to avoid mutation
        // _userDigipet = newDigipet ? { ...newDigipet } : undefined;
    });
}
exports.setDigipet = setDigipet;
function setDigipet2(_userDigipet) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = 2;
        yield setDB(_userDigipet, id);
        // spread to avoid mutation
        // _userDigipet2 = _userDigipet ? { ..._userDigipet } : undefined;
    });
}
exports.setDigipet2 = setDigipet2;
// async/await - check out a client
const getDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const values = [id];
    try {
        const digipetQuery = {
            text: 'SELECT discipline, happiness, nutrition FROM stats ' +
                'WHERE id = $1;',
            values,
            rowMode: 'array',
        };
        let res = yield client.query(digipetQuery);
        res ? console.log(res.rows[0][0]) : console.log("noooo...");
        let digipetStats = {
            discipline: res.rows[0][0],
            happiness: res.rows[0][1],
            nutrition: res.rows[0][2]
        };
        if (id === 1) {
            exports._userDigipet = digipetStats;
            return exports._userDigipet;
        }
        else {
            exports._userDigipet2 = digipetStats;
            return exports._userDigipet2;
        }
    }
    catch (err) {
        console.log("okay...");
        return undefined;
    }
});
exports.getDB = getDB;
// async/await - check out a client
const setDB = ({ discipline, happiness, nutrition }, id) => __awaiter(void 0, void 0, void 0, function* () {
    const values = [discipline, happiness, nutrition, id];
    try {
        yield client.query('INSERT INTO stats (discipline, happiness, nutrition, id) ' +
            'VALUES ($1, $2, $3, $4);', values);
        console.log("Hi3");
    }
    catch (err) {
        yield client.query('UPDATE stats ' +
            'SET discipline = $1, ' +
            'happiness = $2, ' +
            'nutrition = $3 ' +
            'WHERE id = $4;', values);
        console.log("Hi2");
    }
});
// async/await - check out a client
const delDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const values = [id];
    try {
        yield client.query('DELETE FROM stats ' +
            'WHERE id = $1;', values);
    }
    catch (err) {
        console.log(err.stack);
    }
});
exports.delDB = delDB;
/**
 * Makes a bounded update to the user's digipet - increases and decreases up to a maximum of 100 and a minimum of 0
 *
 * @param digipetKey the digipet measure to update
 * @param netUpdate the intended change - e.g. `12` to increase by 12, `-4` to decrease by 4
 */
function updateDigipetBounded(digipetKey, netUpdate) {
    return __awaiter(this, void 0, void 0, function* () {
        const digipetData = yield exports.getDB(1); // is a shallow copy
        if (digipetData) {
            const valueToBound = digipetData[digipetKey] + netUpdate;
            if (valueToBound > 100) {
                digipetData[digipetKey] = 100;
            }
            else if (valueToBound < 0) {
                digipetData[digipetKey] = 0;
            }
            else {
                digipetData[digipetKey] = valueToBound;
            }
            // shallow copy has updated values to set
            yield setDigipet(digipetData);
        }
    });
}
exports.updateDigipetBounded = updateDigipetBounded;

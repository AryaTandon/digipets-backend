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
exports.updateDigipetBounded = exports.setDigipet2 = exports.setDigipet = exports.getDigipet2 = exports.getDigipet = exports._userDigipet2 = exports._userDigipet = exports.INITIAL_DIGIPET = void 0;
const { Pool } = require('pg');
const connectionString = "postgresql://localhost:5432/digipet";
const pool = new Pool({
    connectionString,
});
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
    const id = 1;
    let digipet;
    () => __awaiter(this, void 0, void 0, function* () {
        digipet = yield getDB(id);
    });
    return digipet;
    // spread to create a shallow copy to avoid mutation
    // return _userDigipet ? { ..._userDigipet } : undefined;
}
exports.getDigipet = getDigipet;
function getDigipet2() {
    const id = 2;
    let digipet;
    () => __awaiter(this, void 0, void 0, function* () {
        digipet = yield getDB(id);
    });
    return digipet;
    // spread to create a shallow copy to avoid mutation
    // return _userDigipet2 ? { ..._userDigipet2 } : undefined;
}
exports.getDigipet2 = getDigipet2;
/**
 * Set the user's digipet to a new object (or `undefined`)
 *
 * @param newDigipet The new digipet data; pass `undefined` to effectively remove the digipet
 */
function setDigipet(newDigipet) {
    const id = 1;
    console.log("Hi");
    newDigipet ? setDB(newDigipet, id) : undefined;
    // spread to avoid mutation
    // _userDigipet = newDigipet ? { ...newDigipet } : undefined;
}
exports.setDigipet = setDigipet;
function setDigipet2(_userDigipet) {
    const id = 2;
    _userDigipet ? setDB(_userDigipet, id) : undefined;
    // spread to avoid mutation
    // _userDigipet2 = _userDigipet ? { ..._userDigipet } : undefined;
}
exports.setDigipet2 = setDigipet2;
// async/await - check out a client
const getDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    const values = [id];
    try {
        const digipetQuery = {
            text: 'SELECT (discipline, happiness, nutrition) FROM stats ' +
                'WHERE id = $1;',
            values,
            rowMode: 'array',
        };
        let res = yield pool.query(digipetQuery);
        let digipetStats = {
            happiness: res[0],
            nutrition: res[1],
            discipline: res[2]
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
        return undefined;
    }
    finally {
        client.release();
    }
});
// async/await - check out a client
const setDB = ({ discipline, happiness, nutrition }, id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    const values = [discipline, happiness, nutrition];
    const valuesWithID = [discipline, happiness, nutrition, id];
    try {
        yield pool.query('UPDATE stats ' +
            'SET discipline = $1, ' +
            'happiness = $2, ' +
            'nutrition = $3, ' +
            'WHERE id = $4;', valuesWithID);
        console.log("Hi2");
    }
    catch (err) {
        yield pool.query('INSERT INTO stats (discipline, happiness, nutrition) ' +
            'VALUES ($1, $2, $3);', values);
        console.log("Hi3");
    }
    finally {
        client.release();
    }
});
/**
 * Makes a bounded update to the user's digipet - increases and decreases up to a maximum of 100 and a minimum of 0
 *
 * @param digipetKey the digipet measure to update
 * @param netUpdate the intended change - e.g. `12` to increase by 12, `-4` to decrease by 4
 */
function updateDigipetBounded(digipetKey, netUpdate) {
    const digipetData = getDigipet(); // is a shallow copy
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
        setDigipet(digipetData);
    }
}
exports.updateDigipetBounded = updateDigipetBounded;

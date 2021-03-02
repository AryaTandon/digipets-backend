"use strict";
/**
 * The core Digipet functions.
 *
 * These are encapsulated over in controller.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDigipetBounded = exports.setDigipet2 = exports.setDigipet = exports.getDigipet2 = exports.getDigipet = exports._userDigipet2 = exports._userDigipet = exports.INITIAL_DIGIPET = void 0;
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
    // spread to create a shallow copy to avoid mutation
    return exports._userDigipet ? Object.assign({}, exports._userDigipet) : undefined;
}
exports.getDigipet = getDigipet;
function getDigipet2() {
    // spread to create a shallow copy to avoid mutation
    return exports._userDigipet2 ? Object.assign({}, exports._userDigipet2) : undefined;
}
exports.getDigipet2 = getDigipet2;
/**
 * Set the user's digipet to a new object (or `undefined`)
 *
 * @param newDigipet The new digipet data; pass `undefined` to effectively remove the digipet
 */
function setDigipet(newDigipet) {
    // spread to avoid mutation
    exports._userDigipet = newDigipet ? Object.assign({}, newDigipet) : undefined;
}
exports.setDigipet = setDigipet;
function setDigipet2(_userDigipet) {
    // spread to avoid mutation
    exports._userDigipet2 = _userDigipet ? Object.assign({}, _userDigipet) : undefined;
}
exports.setDigipet2 = setDigipet2;
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

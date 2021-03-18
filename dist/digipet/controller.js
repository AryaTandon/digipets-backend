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
exports.rehomeDigipet = exports.ignoreDigipet = exports.walkDigipet = exports.trainDigipet = exports.hatchDigipet = exports.feedDigipet = void 0;
const model_1 = require("./model");
/**
 * The actions that your Digipet game supports.
 *
 * These update the underlying digipet by using the functions defined in model.ts
 */
function feedDigipet() {
    return __awaiter(this, void 0, void 0, function* () {
        yield model_1.updateDigipetBounded("nutrition", 10);
        yield model_1.updateDigipetBounded("discipline", -5);
    });
}
exports.feedDigipet = feedDigipet;
function hatchDigipet() {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield model_1.getDB(1)) {
            throw new Error("Can't hatch a digipet when you already have one!");
        }
        else {
            // spread to avoid accidental mutation
            const newDigipet = Object.assign({}, model_1.INITIAL_DIGIPET);
            yield model_1.setDigipet(newDigipet);
            return newDigipet;
        }
    });
}
exports.hatchDigipet = hatchDigipet;
function trainDigipet() {
    return __awaiter(this, void 0, void 0, function* () {
        yield model_1.updateDigipetBounded("discipline", 10);
        yield model_1.updateDigipetBounded("happiness", -5);
    });
}
exports.trainDigipet = trainDigipet;
function walkDigipet() {
    return __awaiter(this, void 0, void 0, function* () {
        yield model_1.updateDigipetBounded("happiness", 10);
        yield model_1.updateDigipetBounded("nutrition", -5);
    });
}
exports.walkDigipet = walkDigipet;
function ignoreDigipet() {
    return __awaiter(this, void 0, void 0, function* () {
        yield model_1.updateDigipetBounded("happiness", -10);
        yield model_1.updateDigipetBounded("nutrition", -10);
        yield model_1.updateDigipetBounded("discipline", -10);
    });
}
exports.ignoreDigipet = ignoreDigipet;
function rehomeDigipet() {
    return __awaiter(this, void 0, void 0, function* () {
        const digipet = yield model_1.getDB(1);
        const digipet2 = yield model_1.getDB(2);
        if (digipet && digipet2) {
            throw new Error("Can't rehome another digipet when you already have a 2nd one!");
        }
        else if (digipet && !digipet2) {
            // spread to avoid accidental mutation
            yield model_1.setDigipet2(digipet);
            return digipet;
        }
        else {
            throw new Error("Can't rehome a digipet when you don't have any!");
        }
    });
}
exports.rehomeDigipet = rehomeDigipet;

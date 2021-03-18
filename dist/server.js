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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const model_1 = require("./digipet/model");
const controller_1 = require("./digipet/controller");
const app = express_1.default();
/**
 * Simplest way to connect a front-end. Unimportant detail right now, although you can read more: https://flaviocopes.com/express-cors/
 */
app.use(cors_1.default());
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Digipet, the totally original digital pet game! Keep your pet happy, healthy and well-disciplined to win the game. If in doubt, check out the /instructions endpoint!",
    });
});
app.get("/instructions", (req, res) => {
    res.json({
        message: "Instructions: you can take various actions by clicking the buttons for actions like walk, train, feed, ignore and hatch. For example, try clicking the 'walk' button to walk a digipet. You can also rehome your initial digipet - although it stays in its new home for eternity, and you can't interact with it anymore. You'll have to get another one!",
    });
});
app.get("/digipet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const digipet = yield model_1.getDB(1);
    if (digipet) {
        res.json({
            message: "Your digipet is waiting for you!",
            digipet,
        });
    }
    else {
        res.json({
            message: "You don't have a digipet yet! Try hatching one by clicking the 'hatch' button.",
            description: "This is done by going to endpoint /digipet/hatch",
            digipet: undefined,
        });
    }
}));
app.get("/digipet/hatch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const digipet = yield model_1.getDB(1);
    if (digipet) {
        res.json({
            message: "You can't hatch a digipet now because you already have one!",
            digipet
        });
    }
    else {
        const hatchedDigipet = yield controller_1.hatchDigipet();
        res.json({
            message: "You have successfully hatched an adorable new digipet. Just the cutest.",
            hatchedDigipet
        });
    }
}));
app.get("/digipet/feed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check the user has a digipet to walk
    let digipet = yield model_1.getDB(1);
    if (digipet) {
        yield controller_1.feedDigipet();
        res.json({
            message: "You fed your digipet. It's not as hungry now!",
            digipet: yield model_1.getDB(1)
        });
    }
    else {
        res.json({
            message: "You don't have a digipet to feed! Try hatching one by clicking the 'hatch' button.",
            description: "This is done by going to endpoint /digipet/hatch"
        });
    }
}));
app.get("/digipet/train", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check the user has a digipet to walk
    let digipet = yield model_1.getDB(1);
    if (digipet) {
        yield controller_1.trainDigipet();
        res.json({
            message: "You trained your digipet. It's more disciplined now!",
            digipet: yield model_1.getDB(1)
        });
    }
    else {
        res.json({
            message: "You don't have a digipet to train! Try hatching one by clicking the 'hatch' button.",
            description: "This is done by going to endpoint /digipet/hatch"
        });
    }
}));
app.get("/digipet/walk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check the user has a digipet to walk
    let digipet = yield model_1.getDB(1);
    if (digipet) {
        yield controller_1.walkDigipet();
        res.json({
            message: "You walked your digipet. It looks happier now!",
            digipet: yield model_1.getDB(1)
        });
    }
    else {
        res.json({
            message: "You don't have a digipet to walk! Try hatching one by clicking the 'hatch' button.",
            description: "This is done by going to endpoint /digipet/hatch"
        });
    }
}));
app.get("/digipet/ignore", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check the user has a digipet to walk
    let digipet = yield model_1.getDB(1);
    if (digipet) {
        yield controller_1.ignoreDigipet();
        res.json({
            message: "You ignored your digipet. How could you?!",
            digipet: yield model_1.getDB(1)
        });
    }
    else {
        res.json({
            message: "You don't have a digipet to ignore! Try hatching one by clicking the 'hatch' button.",
            description: "This is done by going to endpoint /digipet/hatch"
        });
    }
}));
app.get("/digipet/rehome", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const digipet = yield model_1.getDB(1);
    const digipet2 = yield model_1.getDB(2);
    if (digipet2) {
        res.json({
            message: "You can't rehome another digipet because you already have one rehomed! You can't interact with this digipet anymore now.",
            digipet2,
        });
    }
    else if (digipet && !digipet2) {
        yield controller_1.rehomeDigipet();
        yield model_1.delDB(1);
        res.json({
            message: "You have successfully rehomed your 1st digipet! You can't interact with this digipet anymore now.",
            digipet2: yield model_1.getDB(2)
        });
    }
    else {
        res.json({
            message: "You can't rehome a digipet because you don't have any!",
        });
    }
}));
app.get("/digipet/setfree", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const digipet2 = yield model_1.getDB(2);
    if (!digipet2) {
        res.json({
            message: "You can't set free your rehomed digipet because you don't have one rehomed!",
        });
    }
    else {
        yield model_1.delDB(2);
        res.json({
            message: "You have successfully set your rehomed digipet free!",
        });
    }
}));
exports.default = app;

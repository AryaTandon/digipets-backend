"use strict";
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
app.get("/digipet", (req, res) => {
    const digipet = model_1.getDigipet();
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
});
app.get("/digipet/hatch", (req, res) => {
    const digipet = model_1.getDigipet();
    if (digipet) {
        res.json({
            message: "You can't hatch a digipet now because you already have one!",
            digipet,
        });
    }
    else {
        const digipet = controller_1.hatchDigipet();
        res.json({
            message: "You have successfully hatched an adorable new digipet. Just the cutest.",
            digipet,
        });
    }
});
app.get("/digipet/feed", (req, res) => {
    // check the user has a digipet to walk
    if (model_1.getDigipet()) {
        controller_1.feedDigipet();
        res.json({
            message: "You fed your digipet. It's not as hungry now!",
            digipet: model_1.getDigipet(),
        });
    }
    else {
        res.json({
            message: "You don't have a digipet to feed! Try hatching one by clicking the 'hatch' button.",
            description: "This is done by going to endpoint /digipet/hatch"
        });
    }
});
app.get("/digipet/train", (req, res) => {
    // check the user has a digipet to walk
    if (model_1.getDigipet()) {
        controller_1.trainDigipet();
        res.json({
            message: "You trained your digipet. It's more disciplined now!",
            digipet: model_1.getDigipet(),
        });
    }
    else {
        res.json({
            message: "You don't have a digipet to train! Try hatching one by clicking the 'hatch' button.",
            description: "This is done by going to endpoint /digipet/hatch"
        });
    }
});
app.get("/digipet/walk", (req, res) => {
    // check the user has a digipet to walk
    if (model_1.getDigipet()) {
        controller_1.walkDigipet();
        res.json({
            message: "You walked your digipet. It looks happier now!",
            digipet: model_1.getDigipet(),
        });
    }
    else {
        res.json({
            message: "You don't have a digipet to walk! Try hatching one by clicking the 'hatch' button.",
            description: "This is done by going to endpoint /digipet/hatch"
        });
    }
});
app.get("/digipet/ignore", (req, res) => {
    // check the user has a digipet to walk
    if (model_1.getDigipet()) {
        controller_1.ignoreDigipet();
        res.json({
            message: "You ignored your digipet. How could you?!",
            digipet: model_1.getDigipet(),
        });
    }
    else {
        res.json({
            message: "You don't have a digipet to ignore! Try hatching one by clicking the 'hatch' button.",
            description: "This is done by going to endpoint /digipet/hatch"
        });
    }
});
app.get("/digipet/rehome", (req, res) => {
    const digipet = model_1.getDigipet();
    const digipet2 = model_1.getDigipet2();
    if (digipet2) {
        res.json({
            message: "You can't rehome another digipet because you already have one rehomed!",
            digipet2,
        });
    }
    else if (digipet && !digipet2) {
        const digipet2 = controller_1.rehomeDigipet();
        model_1.setDigipet(undefined);
        res.json({
            message: "You have successfully rehomed your 1st digipet!",
            digipet2,
        });
    }
    else {
        res.json({
            message: "You can't rehome a digipet because you don't have any!",
        });
    }
});
exports.default = app;

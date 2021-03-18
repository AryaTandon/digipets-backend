import express from "express";
import cors from "cors";
import { delDB, getDB, getDigipet, getDigipet2, setDigipet, setDigipet2 } from "./digipet/model";
import { hatchDigipet, trainDigipet, feedDigipet, walkDigipet, ignoreDigipet, rehomeDigipet } from "./digipet/controller";

const app = express();

/**
 * Simplest way to connect a front-end. Unimportant detail right now, although you can read more: https://flaviocopes.com/express-cors/
 */
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to Digipet, the totally original digital pet game! Keep your pet happy, healthy and well-disciplined to win the game. If in doubt, check out the /instructions endpoint!",
  });
});

app.get("/instructions", (req, res) => {
  res.json({
    message:
      "Instructions: you can take various actions by clicking the buttons for actions like walk, train, feed, ignore and hatch. For example, try clicking the 'walk' button to walk a digipet. You can also rehome your initial digipet - although it stays in its new home for eternity, and you can't interact with it anymore. You'll have to get another one!",
  });
});

app.get("/digipet", async (req, res) => {
  const digipet = await getDB(1);
  if (digipet) {
    res.json({
      message: "Your digipet is waiting for you!",
      digipet, // equivalent to digipet: digipet
    });
  } else {
    res.json({
      message: "You don't have a digipet yet! Try hatching one by clicking the 'hatch' button.",
      description: "This is done by going to endpoint /digipet/hatch",
      digipet: undefined,
    });
  }
});

app.get("/digipet/hatch", async (req, res) => {
  const digipet = await getDB(1);
  if (digipet) {
    res.json({
      message: "You can't hatch a digipet now because you already have one!",
      digipet
    });
  } else {
    const hatchedDigipet = await hatchDigipet();
    res.json({
      message:
        "You have successfully hatched an adorable new digipet. Just the cutest.",
      hatchedDigipet
    });
  }
});

app.get("/digipet/feed", async (req, res) => {
  // check the user has a digipet to walk
  let digipet = await getDB(1);
  if (digipet) {
    await feedDigipet();
    res.json({
      message: "You fed your digipet. It's not as hungry now!",
      digipet: await getDB(1)
    });
  } else {
    res.json({
      message:
        "You don't have a digipet to feed! Try hatching one by clicking the 'hatch' button.",
        description:
        "This is done by going to endpoint /digipet/hatch"
    });
  }
});

app.get("/digipet/train", async (req, res) => {
  // check the user has a digipet to walk
  let digipet = await getDB(1);
  if (digipet) {
    await trainDigipet();
    res.json({
      message: "You trained your digipet. It's more disciplined now!",
      digipet: await getDB(1)
    });
  } else {
    res.json({
      message:
        "You don't have a digipet to train! Try hatching one by clicking the 'hatch' button.",
        description:
        "This is done by going to endpoint /digipet/hatch"
    });
  }
});

app.get("/digipet/walk", async (req, res) => {
  // check the user has a digipet to walk
  let digipet = await getDB(1);
  if (digipet) {
    await walkDigipet();
    res.json({
      message: "You walked your digipet. It looks happier now!",
      digipet: await getDB(1)
    });
  } else {
    res.json({
      message:
        "You don't have a digipet to walk! Try hatching one by clicking the 'hatch' button.",
        description:
        "This is done by going to endpoint /digipet/hatch"
    });
  }
});

app.get("/digipet/ignore", async (req, res) => {
  // check the user has a digipet to walk
  let digipet = await getDB(1);
  if (digipet) {
    await ignoreDigipet();
    res.json({
      message: "You ignored your digipet. How could you?!",
      digipet: await getDB(1)
    });
  } else {
    res.json({
      message:
        "You don't have a digipet to ignore! Try hatching one by clicking the 'hatch' button.",
        description:
        "This is done by going to endpoint /digipet/hatch"
    });
  }
});

app.get("/digipet/rehome", async (req, res) => {
  const digipet = await getDB(1);
  const digipet2 = await getDB(2);
  if (digipet2) {
    res.json({
      message:
        "You can't rehome another digipet because you already have one rehomed! You can't interact with this digipet anymore now.",
      digipet2,
    });
  } else if (digipet && !digipet2) {
      await rehomeDigipet()
      await delDB(1);
      res.json({
        message:
          "You have successfully rehomed your 1st digipet! You can't interact with this digipet anymore now.",
        digipet2: await getDB(2)
      });
  } else {
      res.json({
        message: "You can't rehome a digipet because you don't have any!",
      });
    }
});

app.get("/digipet/setfree", async (req, res) => {
  const digipet2 = await getDB(2);
  if (!digipet2) {
    res.json({
      message:
        "You can't set free your rehomed digipet because you don't have one rehomed!",
    });
  } else {
    await delDB(2);
    res.json({
      message:
        "You have successfully set your rehomed digipet free!",
    });
  }
});

export default app;

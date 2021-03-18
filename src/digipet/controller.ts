import {
  Digipet,
  getDigipet,
  INITIAL_DIGIPET,
  setDigipet,
  updateDigipetBounded,
  getDB,
  getDigipet2,
  setDigipet2,
} from "./model";

/**
 * The actions that your Digipet game supports.
 *
 * These update the underlying digipet by using the functions defined in model.ts
 */

export async function feedDigipet(): Promise<void> {
  await updateDigipetBounded("nutrition", 10);
  await updateDigipetBounded("discipline", -5);
}

export async function hatchDigipet(): Promise<Digipet> {
  if (await getDB(1)) {
    throw new Error("Can't hatch a digipet when you already have one!");
  } else {
    // spread to avoid accidental mutation
    const newDigipet = { ...INITIAL_DIGIPET };
    await setDigipet(newDigipet);
    return newDigipet;
  }
}

export async function trainDigipet(): Promise<void> {
  await updateDigipetBounded("discipline", 10);
  await updateDigipetBounded("happiness", -5);
}

export async function walkDigipet(): Promise<void> {
  await updateDigipetBounded("happiness", 10);
  await updateDigipetBounded("nutrition", -5);
}

export async function ignoreDigipet(): Promise<void> {
  await updateDigipetBounded("happiness", -10);
  await updateDigipetBounded("nutrition", -10);
  await updateDigipetBounded("discipline", -10);
}

export async function rehomeDigipet(): Promise<Digipet | undefined> {
  const digipet = await getDB(1);
  const digipet2 = await getDB(2);
  if (digipet && digipet2) {
    throw new Error("Can't rehome another digipet when you already have a 2nd one!");
  } else if (digipet && !digipet2) {
    // spread to avoid accidental mutation
    await setDigipet2(digipet)
    return digipet;
  } else {
    throw new Error("Can't rehome a digipet when you don't have any!");
  }
}
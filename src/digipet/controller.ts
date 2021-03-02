import {
  Digipet,
  getDigipet,
  INITIAL_DIGIPET,
  setDigipet,
  updateDigipetBounded,
  getDigipet2,
  setDigipet2,
} from "./model";

/**
 * The actions that your Digipet game supports.
 *
 * These update the underlying digipet by using the functions defined in model.ts
 */

export function feedDigipet(): void {
  updateDigipetBounded("nutrition", 10);
  updateDigipetBounded("discipline", -5);
}

export function hatchDigipet(): Digipet {
  if (getDigipet()) {
    throw new Error("Can't hatch a digipet when you already have one!");
  } else {
    // spread to avoid accidental mutation
    const newDigipet = { ...INITIAL_DIGIPET };
    setDigipet(newDigipet);
    return newDigipet;
  }
}

export function trainDigipet(): void {
  updateDigipetBounded("discipline", 10);
  updateDigipetBounded("happiness", -5);
}

export function walkDigipet(): void {
  updateDigipetBounded("happiness", 10);
  updateDigipetBounded("nutrition", -5);
}

export function ignoreDigipet(): void {
  updateDigipetBounded("happiness", -10);
  updateDigipetBounded("nutrition", -10);
  updateDigipetBounded("discipline", -10);
}

export function rehomeDigipet(): Digipet | undefined {
  if (getDigipet() && getDigipet2()) {
    throw new Error("Can't rehome another digipet when you already have a 2nd one!");
  } else if (getDigipet() && !getDigipet2()) {
    // spread to avoid accidental mutation
    const firstDigipet = getDigipet();
    setDigipet2(firstDigipet);
    return firstDigipet;
  } else {
    throw new Error("Can't rehome a digipet when you don't have any!");
  }
}
import supertest from "supertest";
import { delDB, INITIAL_DIGIPET, setDigipet } from "../digipet/model";
import app from "../server";

describe("User can't rehome a digipet if they don't have any", () => {
  // setup: ensure there is no digipet to begin with
  delDB(1);

  test("1st GET /digipet informs them that they currently have a digipet", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/don't have/i);
    expect(response.body.digipet).not.toBeDefined();
  });

  test("1st If they hatch one, GET /digipet/rehome informs them that they have rehomed their current digipet and includes initial digipet data", async () => {
    await supertest(app).get("/digipet/hatch");
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.message).toMatch(/success/i);
    expect(response.body.message).toMatch(/rehome/i);
    expect(response.body.digipet2).toHaveProperty(
      "happiness",
      INITIAL_DIGIPET.happiness
    );
    expect(response.body.digipet2).toHaveProperty(
      "nutrition",
      INITIAL_DIGIPET.nutrition
    );
    expect(response.body.digipet2).toHaveProperty(
      "discipline",
      INITIAL_DIGIPET.discipline
    );
  });

  test("2nd GET /digipet/rehome now informs them that they can't rehome another digipet because they have a rehomed digipet", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.message).toMatch(/already have one/i);
    expect(response.body.digipet2).toBeDefined();
  });

  test("3rd GET /digipet/rehome informs them that they can't rehome another digipet because they have a rehomed digipet", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.message).toMatch(/already have one/i);
    expect(response.body.digipet2).toHaveProperty(
      "happiness",
      INITIAL_DIGIPET.happiness
    );
    expect(response.body.digipet2).toHaveProperty(
      "nutrition",
      INITIAL_DIGIPET.nutrition
    );
    expect(response.body.digipet2).toHaveProperty(
      "discipline",
      INITIAL_DIGIPET.discipline
    );
  });
});

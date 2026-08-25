import assert from "assert";
import { ColyseusTestServer, boot } from "@colyseus/testing";
import { JWT } from "colyseus";

// import your "app.config.ts" file here.
import appConfig from "../src/app.config.js";

describe("testing your Colyseus app", () => {
  let colyseus: ColyseusTestServer<typeof appConfig>;

  before(async () => colyseus = await boot(appConfig));
  after(async () => colyseus.shutdown());

  beforeEach(async () => {
    await colyseus.cleanup();

    // cleanup() signs the SDK out, so the token is set per test, not once.
    colyseus.sdk.auth.token = await JWT.sign({ username: "Player 1" });
  });

  it("connecting into a room", async () => {
    // `room` is the server-side Room instance reference.
    const room = await colyseus.createRoom("my_room", {});

    // `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
    const client1 = await colyseus.connectTo(room);

    // make your assertions
    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);

    // wait for state sync
    await room.waitForNextPatch();

    // the username comes from the JWT payload verified by `MyRoom.onAuth()`
    assert.strictEqual(client1.state.players.get(client1.sessionId).username, "Player 1");
  });
});

import { Room, Client, CloseCode, JWT } from "colyseus";
import { MyRoomState, Player, Vec2 } from "./schema/MyRoomState.js";

export class MyRoom extends Room<{
  state: MyRoomState,
  metadata: { channelId: string }, // matchmaking filter, see app.config.ts
}> {
  state = new MyRoomState();
  maxClients = 4;

  static onAuth(token: string) {
    return JWT.verify(token);
  }

  onCreate (options: any) {
    this.onMessage("move", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      player.position.x = message.x;
      player.position.y = message.y;
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player({
      username: client.auth?.username || "Guest",
      heroType: Math.floor(Math.random() * 12) + 1,
      position: new Vec2({
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
      }),
    }));
  }

  onLeave (client: Client, code: CloseCode) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}

import { JWT } from "@colyseus/auth";
import { Room, Client } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";

export class Vec2 extends Schema {
  @type("number") x!: number;
  @type("number") y!: number;
}

export class Player extends Schema {
  @type("string") username!: string;
  @type("number") heroType!: number; // sprite to use (1-12)
  @type(Vec2) position = new Vec2();
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export class MyRoom extends Room {
  state = new MyRoomState();
  maxClients = 4;

  static onAuth(token: string) {
    return JWT.verify(token);
  }

  onCreate (options: any) {
    this.onMessage("move", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) {
        return;
      }
      player.position.x = message.x;
      player.position.y = message.y;
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    const player = new Player();
    player.username = client.auth?.username || "Guest";
    player.heroType = Math.floor(Math.random() * 12) + 1;
    player.position.x = Math.floor(Math.random() * 100);
    player.position.y = Math.floor(Math.random() * 100);
    this.state.players.set(client.sessionId, player);
  }

  onLeave (client: Client, code: number) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = exports.MyRoomState = exports.Player = exports.Vec2 = void 0;
const auth_1 = require("@colyseus/auth");
const colyseus_1 = require("colyseus");
const schema_1 = require("@colyseus/schema");
class Vec2 extends schema_1.Schema {
}
exports.Vec2 = Vec2;
__decorate([
    (0, schema_1.type)("number")
], Vec2.prototype, "x", void 0);
__decorate([
    (0, schema_1.type)("number")
], Vec2.prototype, "y", void 0);
class Player extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.position = new Vec2();
    }
}
exports.Player = Player;
__decorate([
    (0, schema_1.type)("string")
], Player.prototype, "username", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "heroType", void 0);
__decorate([
    (0, schema_1.type)(Vec2)
], Player.prototype, "position", void 0);
class MyRoomState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
    }
}
exports.MyRoomState = MyRoomState;
__decorate([
    (0, schema_1.type)({ map: Player })
], MyRoomState.prototype, "players", void 0);
class MyRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.state = new MyRoomState();
        this.maxClients = 4;
    }
    static onAuth(token) {
        return auth_1.JWT.verify(token);
    }
    onCreate(options) {
        this.onMessage("move", (client, message) => {
            const player = this.state.players.get(client.sessionId);
            player.position.x = message.x;
            player.position.y = message.y;
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        const player = new Player();
        player.username = client.auth?.username || "Guest";
        player.heroType = Math.floor(Math.random() * 12) + 1;
        player.position.x = Math.floor(Math.random() * 100);
        player.position.y = Math.floor(Math.random() * 100);
        this.state.players.set(client.sessionId, player);
    }
    onLeave(client, code) {
        console.log(client.sessionId, "left!");
        this.state.players.delete(client.sessionId);
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
exports.MyRoom = MyRoom;

import { schema, t, type SchemaType } from "@colyseus/schema";

export const Vec2 = schema({
  x: t.number(),
  y: t.number(),
}, "Vec2");
export type Vec2 = SchemaType<typeof Vec2>;

export const Player = schema({
  username: t.string(),
  heroType: t.number(), // sprite to use (1-12)
  position: Vec2,
}, "Player");
export type Player = SchemaType<typeof Player>;

export const MyRoomState = schema({
  players: t.map(Player),
}, "MyRoomState");
export type MyRoomState = SchemaType<typeof MyRoomState>;

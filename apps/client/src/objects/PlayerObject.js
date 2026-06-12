import * as PIXI from "pixi.js";
export class PlayerObject extends PIXI.Container {
    constructor(player) {
        super();
        // hero sprite
        const sprite = new PIXI.Sprite(PIXI.Assets.get("hero" + player.heroType));
        sprite.anchor.set(0.5, 0.5);
        this.addChild(sprite);
        // username
        const username = new PIXI.Text({
            text: "#" + player.username,
            anchor: 0.5,
            style: {
                fontSize: 4,
                fill: 0xffffff,
                stroke: 0x000000,
            }
        });
        username.position.y = 10;
        this.addChild(username);
    }
}

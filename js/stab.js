// Player クラス
export class Player {
    constructor(name, hand = []) {
        this.name = name;
        this.hand = hand;
        this.point = 0;
    }

    setHand(hand) {
        this.hand = hand;
        this.hand.forEach(c => c.used = false);
    }

    addPoint() {
        this.point++;
    }

    reset(name, hand = []) {
        this.name = name;
        this.hand = hand;
        this.point = 0;
    }
}

// ----------------------------------------------------
// gameState をプレイヤー2人で管理
// ----------------------------------------------------

import * as CARD from "./card.js";

export const gameState = {
    turn: 1,

    mine: new Player("自分", CARD.choice("max")),
    enemy: new Player("敵", CARD.choice("normal")),
};

import * as CARD from "./card.js";

export function choiceCards() {
    // バニラ5枚を deep copy して返す
    // 1枚ずつ {...card} で独立オブジェクトにする
    return CARD.cards.map(card => ({ ...card }));
}

export function choiceCards2() {
    // バニラ5枚を deep copy して返す
    // 1枚ずつ {...card} で独立オブジェクトにする
    return CARD.cards2.map(card => ({ ...card }));
}

export const gameState = {
    turn: 1,
    minePoint: 0,
    enemyPoint: 0,
    mineHand: [],
    enemyHand: [],
};

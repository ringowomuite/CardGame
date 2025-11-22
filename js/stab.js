import * as CARD from "./card.js";

export function choiceCards() {
    // バニラ5枚を deep copy して返す
    // 1枚ずつ {...card} で独立オブジェクトにする
    return CARD.cards.map(card => ({ ...card }));
}

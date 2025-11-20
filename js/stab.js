import * as Card from "./card.js";

export function choiceCards() {
    // バニラ5枚を deep copy して返す
    // 1枚ずつ {...card} で独立オブジェクトにする
    return Card.cards.map(card => ({ ...card }));
}

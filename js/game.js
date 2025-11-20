import * as Config from "./config.js";
import * as Stab from "./stab.js";

let enemyHand = [];
let mineHand = [];

export function start() {

    // TODO カード選択フェーズ
    // スタブ処理として、拡張var1のカード5枚を選択とする
    enemyHand = Stab.choiceCards();
    mineHand = Stab.choiceCards();

}

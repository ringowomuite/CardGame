import * as Config from "./config.js";
import * as Stab from "./stab.js";

let enemyHand = [];
let mineHand = [];

export async function start() {

    // スタンバイフェーズを呼び出す
    callStandByPhase();
    // バトルフェーズを呼び出す
    await callBattlePhase();
    // エンドフェーズを呼び出す
    callEndPhase();

}

// スタンバイフェーズ呼び出し
function callStandByPhase() {
    console.log("スタンバイフェーズに入りました");

    // TODO カード選択フェーズ
    // スタブ処理として、拡張var1のカード5枚を選択とする
    enemyHand = Stab.choiceCards();
    mineHand = Stab.choiceCards();
    console.log("スタンバイフェーズを終了します");
}

// バトルフェーズ呼び出し
function callBattlePhase() {
    console.log("バトルフェーズに入りました");

    console.log("バトルフェーズを終了します");
}

// エンドフェーズ呼び出し
function callEndPhase() {
    console.log("エンドフェーズに入りました");

    console.log("エンドフェーズを終了します");
}
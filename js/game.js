import * as CONFIG from "./config.js";
import * as STAB from "./stab.js";
import * as UI from "./ui.js";

// 手札
export let enemyHand = [];
export let mineHand = [];

// 勝利ポイント
export let minePoint = 0;
export let enemyPoint = 0;

// ターン
export let turn = 1;

/**
 * ゲーム開始時に 1 度だけ呼ばれる
 * 手札作成 + UI 反映のみ
 */
export function setupGame() {
    UI.addLog(CONFIG.GAME_START);

    // 固定のカード5枚配布（スタブ）
    enemyHand = STAB.choiceCards();
    mineHand = STAB.choiceCards();

    // UI 反映
    UI.renderHand(mineHand, CONFIG.MINE);
    UI.renderHand(enemyHand, CONFIG.ENEMY);

    UI.addLog(CONFIG.HAND_SET_END);
}

export async function cardJudge(mineCard, enemyCard, mineIndex, enemyIndex) {
    const minePower = mineCard.base;
    const enemyPower = enemyCard.base;

    // カード削除（nullを入れる）
    mineHand[mineIndex] = null;
    UI.renderHand(mineHand, CONFIG.MINE);
    enemyHand[enemyIndex] = null;
    UI.renderHand(enemyHand, CONFIG.ENEMY);
    
    // ★ 0.5秒待つ
    await new Promise(resolve => setTimeout(resolve, 500));

    if (minePower > enemyPower) {
        // 得点の変更、表示、ログ出力
        minePoint++;
        UI.updatePoint(minePoint, CONFIG.MINE);
        alert(CONFIG.CARD_JUDGE_WIN("あなた"));
        UI.addLog(CONFIG.CARD_JUDGE_WIN("あなた"));
    } else if (minePower < enemyPower) {
        // 得点の変更、表示、ログ出力
        enemyPoint++;
        UI.updatePoint(enemyPoint, CONFIG.ENEMY);
        alert(CONFIG.CARD_JUDGE_WIN("あいて"));
        UI.addLog(CONFIG.CARD_JUDGE_WIN("あいて"));
    } else {
        alert(CONFIG.CARD_JUDGE_DROW);
        UI.addLog(CONFIG.CARD_JUDGE_DROW);
    }

    // ターン表示更新
    UI.updateTurn(++turn);
    // 次ターンへ…
}

export function endGame() {
    
    UI.addLog(CONFIG.GAME_END);

    if (minePoint > enemyPoint) {
        // alert(CONFIG.BATTLE_JUDGE_WIN("あなた"));
        UI.addLog(CONFIG.BATTLE_JUDGE_WIN("あなた", minePoint, enemyPoint));
    } else if (minePoint < enemyPoint) {
        // alert(CONFIG.BATTLE_JUDGE_WIN("あいて"));
        UI.addLog(CONFIG.BATTLE_JUDGE_WIN("あいて", minePoint, enemyPoint));
    } else {
        // alert(CONFIG.BATTLE_JUDGE_DROW);
        UI.addLog(CONFIG.BATTLE_JUDGE_DROW("あなた", minePoint, enemyPoint));
    }
}
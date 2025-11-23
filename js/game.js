import * as CONFIG from "./config.js";
import * as STAB from "./stab.js";
import * as UI from "./ui.js";
import { applySkill } from "./skill.js";



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
    mineHand = STAB.choiceCards2();

    // UI 反映
    UI.renderHand(mineHand, CONFIG.MINE);
    UI.renderHand(enemyHand, CONFIG.ENEMY);

    UI.addLog(CONFIG.HAND_SET_END);
}

export async function cardJudge(mineCard, enemyCard, mineIndex, enemyIndex) {

    // processDecision 内
    const minePower = applySkill(mineCard, "mine");
    const enemyPower = applySkill(enemyCard, "enemy");

    // 使用済みフラグを付与する
    mineHand[mineIndex].used = true;
    enemyHand[enemyIndex].used = true;

    // UI 更新
    UI.renderHand(mineHand, CONFIG.MINE);
    UI.renderHand(enemyHand, CONFIG.ENEMY);

    // ★ 0.5秒待つ
    await new Promise(resolve => setTimeout(resolve, 500));

    if (minePower > enemyPower) {
        // 得点の変更、表示、ログ出力
        minePoint++;
        UI.updatePoint(minePoint, CONFIG.MINE);
        alert(CONFIG.CARD_JUDGE_WIN(UI.MINE_NAME));
        UI.addLog(CONFIG.CARD_JUDGE_WIN(UI.MINE_NAME));
    } else if (minePower < enemyPower) {
        // 得点の変更、表示、ログ出力
        enemyPoint++;
        UI.updatePoint(enemyPoint, CONFIG.ENEMY);
        alert(CONFIG.CARD_JUDGE_WIN(UI.ENEMY_NAME));
        UI.addLog(CONFIG.CARD_JUDGE_WIN(UI.ENEMY_NAME));
    } else {
        alert(CONFIG.CARD_JUDGE_DROW);
        UI.addLog(CONFIG.CARD_JUDGE_DROW);
    }
    if (minePoint === CONFIG.WIN_POINT || enemyPoint === CONFIG.WIN_POINT) {
        endGame();
        return;
    }

    // 全ターン終了でゲーム終了
    if (turn === CONFIG.MAX_TURN) {
        endGame();
        return;
    }
    // ターン表示更新
    nextTurn();

}

// ターン表示更新
export function nextTurn() {
    turn++;
    UI.updateTurn(turn);
}

// ゲーム終了時の判定
export function endGame() {

    UI.addLog(CONFIG.GAME_END);

    if (minePoint > enemyPoint) {
        UI.addLog(CONFIG.BATTLE_JUDGE_WIN(UI.MINE_NAME, minePoint, enemyPoint));
    } else if (minePoint < enemyPoint) {
        UI.addLog(CONFIG.BATTLE_JUDGE_WIN(UI.ENEMY_NAME, minePoint, enemyPoint));
    } else {
        UI.addLog(CONFIG.BATTLE_JUDGE_DROW(UI.MINE_NAME, minePoint, enemyPoint));
    }
    
    // ★ バトル終了後はカード全てを使用不可 & 半透明にする
    UI.disableAllHandCards();
}

export function processDecision() {

    // ▼ 1. 自分のカードを描画
    const mineIndex = UI.getSelectedMineIndex();
    const mineCard = mineHand[mineIndex];
    UI.renderOpenCard(mineCard, CONFIG.MINE);

    UI.addLog(CONFIG.SELECT_CARD(UI.MINE_NAME, mineCard.name));

    // ▼ 2. 相手の手札からランダムで選択
    const enemyIndex = getRandomEnemyIndex();
    const enemyCard = enemyHand[enemyIndex];

    // ▼ 3. 相手カード描画
    UI.renderOpenCard(enemyCard, CONFIG.ENEMY);
    UI.addLog(CONFIG.SELECT_CARD(UI.ENEMY_NAME, enemyCard.name));

    // ▼ 4. （必要なら）勝敗判定へ
    cardJudge(mineCard, enemyCard, mineIndex, enemyIndex);
}

function getRandomEnemyIndex() {
    const aliveIndexes = enemyHand
        .map((card, index) => card ? index : null)
        .filter(index => index !== null);

    // aliveIndexes が [0, 2, 4] のようになる
    const rand = Math.floor(Math.random() * aliveIndexes.length);
    return aliveIndexes[rand];
}
import * as CONFIG from "./config.js";
import * as STAB from "./stab.js";
import * as UI from "./ui.js";
import { applySkill } from "./skill.js";
import { gameState } from "./stab.js";


// --------------------------------------
// ※ 手札・ポイント・ターン → gameState に一本化
// --------------------------------------


/**
 * ゲーム開始時に 1 度だけ呼ばれる
 * 手札作成 + UI 反映のみ
 */
export function setupGame() {
    UI.addLog(CONFIG.GAME_START);

    // 固定のカード5枚配布
    gameState.enemyHand = STAB.choiceCards();
    gameState.mineHand = STAB.choiceCards2();

    // UI 反映
    UI.renderHand(gameState.mineHand, CONFIG.MINE);
    UI.renderHand(gameState.enemyHand, CONFIG.ENEMY);

    UI.addLog(CONFIG.HAND_SET_END);
}


export async function cardJudge(mineCard, enemyCard, mineIndex, enemyIndex) {

    const minePower = applySkill(mineCard, "mine");
    const enemyPower = applySkill(enemyCard, "enemy");

    // 使用済みフラグ付与
    gameState.mineHand[mineIndex].used = true;
    gameState.enemyHand[enemyIndex].used = true;

    // UI 更新
    UI.renderHand(gameState.mineHand, CONFIG.MINE);
    UI.renderHand(gameState.enemyHand, CONFIG.ENEMY);

    // 0.5秒待つ
    await new Promise(resolve => setTimeout(resolve, 500));

    if (minePower > enemyPower) {

        gameState.minePoint++;
        UI.updatePoint(gameState.minePoint, CONFIG.MINE);

        alert(CONFIG.CARD_JUDGE_WIN(UI.MINE_NAME));
        UI.addLog(CONFIG.CARD_JUDGE_WIN(UI.MINE_NAME));

    } else if (minePower < enemyPower) {

        gameState.enemyPoint++;
        UI.updatePoint(gameState.enemyPoint, CONFIG.ENEMY);

        alert(CONFIG.CARD_JUDGE_WIN(UI.ENEMY_NAME));
        UI.addLog(CONFIG.CARD_JUDGE_WIN(UI.ENEMY_NAME));

    } else {
        alert(CONFIG.CARD_JUDGE_DROW);
        UI.addLog(CONFIG.CARD_JUDGE_DROW);
    }


    // 勝利条件
    if (gameState.minePoint === CONFIG.WIN_POINT ||
        gameState.enemyPoint === CONFIG.WIN_POINT) {
        endGame();
        return;
    }

    // 全ターン終了
    if (gameState.turn === CONFIG.MAX_TURN) {
        endGame();
        return;
    }

    nextTurn();
}


// ターン表示更新
export function nextTurn() {
    gameState.turn++;
    UI.updateTurn(gameState.turn);
}


// ゲーム終了処理
export function endGame() {

    UI.addLog(CONFIG.GAME_END);

    if (gameState.minePoint > gameState.enemyPoint) {

        UI.addLog(
            CONFIG.BATTLE_JUDGE_WIN(UI.MINE_NAME, gameState.minePoint, gameState.enemyPoint)
        );

    } else if (gameState.minePoint < gameState.enemyPoint) {

        UI.addLog(
            CONFIG.BATTLE_JUDGE_WIN(UI.ENEMY_NAME, gameState.minePoint, gameState.enemyPoint)
        );

    } else {

        UI.addLog(
            CONFIG.BATTLE_JUDGE_DROW(UI.MINE_NAME, gameState.minePoint, gameState.enemyPoint)
        );
    }

    // バトル終了後：手札を全て非活性
    UI.disableAllHandCards();
}



// ――― プレイヤーのカード選択 → 判定まで ―――
export function processDecision() {

    // 1. 自分の手札からカード取得
    const mineIndex = UI.getSelectedMineIndex();
    const mineCard = gameState.mineHand[mineIndex];

    UI.renderOpenCard(mineCard, CONFIG.MINE);
    UI.addLog(CONFIG.SELECT_CARD(UI.MINE_NAME, mineCard.name));

    // 2. 敵の手札ランダム
    const enemyIndex = getRandomEnemyIndex();
    const enemyCard = gameState.enemyHand[enemyIndex];

    UI.renderOpenCard(enemyCard, CONFIG.ENEMY);
    UI.addLog(CONFIG.SELECT_CARD(UI.ENEMY_NAME, enemyCard.name));

    // 3. 勝敗判定へ
    cardJudge(mineCard, enemyCard, mineIndex, enemyIndex);
}


// 生存している敵カードからランダム選択
function getRandomEnemyIndex() {
    const aliveIndexes = gameState.enemyHand
        .map((card, i) => (!card.used ? i : null))   // ← これが正しい
        .filter(i => i !== null);

    const rand = Math.floor(Math.random() * aliveIndexes.length);
    return aliveIndexes[rand];
}

export function retryBattle() {

    // --- 1. gameState リセット ---
    gameState.turn = 1;
    gameState.minePoint = 0;
    gameState.enemyPoint = 0;
    gameState.mineHand = STAB.choiceCards2();
    gameState.enemyHand = STAB.choiceCards();

    // --- 2. UI 初期化 ---
    UI.clearLog();
    UI.addLog(CONFIG.GAME_START_NEW);
    
    UI.updateTurn(gameState.turn);
    UI.updatePoint(0, CONFIG.MINE);
    UI.updatePoint(0, CONFIG.ENEMY);

    UI.clearOpenArea(CONFIG.MINE);
    UI.clearOpenArea(CONFIG.ENEMY);

    UI.renderHand(gameState.mineHand, CONFIG.MINE);
    UI.renderHand(gameState.enemyHand, CONFIG.ENEMY);

    UI.enableAllHandCards();
    UI.hideRetryButton();

}
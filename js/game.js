import * as CONFIG from "./config.js";
import * as CARD from "./card.js";
import * as UI from "./ui.js";
import { applySkill } from "./skill.js";
import { gameState } from "./stab.js";

// 共通：ポイント加算
function addPoint(playerType) {
    const player = playerType === CONFIG.MINE ? gameState.mine : gameState.enemy;
    const playerName = playerType === CONFIG.MINE ? UI.MINE_NAME : UI.ENEMY_NAME;

    player.addPoint();
    UI.updatePoint(player.point, playerType);

    const msg = CONFIG.CARD_JUDGE_WIN(playerName);
    alert(msg);
    UI.addLog(msg);
}

// 勝者取得（引き分けは自分＝親）
function getWinner() {
    if (gameState.mine.point === gameState.enemy.point) {
        return UI.MINE_NAME;
    }
    return gameState.mine.point > gameState.enemy.point
        ? UI.MINE_NAME
        : UI.ENEMY_NAME;
}

// 生存している敵カードからランダム選択
function getRandomEnemyIndex() {
    const aliveIndexes = gameState.enemy.hand
        .map((card, i) => (!card.used ? i : null))
        .filter(i => i !== null);

    const rand = Math.floor(Math.random() * aliveIndexes.length);
    return aliveIndexes[rand];
}

// ゲーム開始：手札作成 + UI
export function setupGame() {

    gameState.turn = 1;
    gameState.mine.reset(UI.MINE_NAME, CARD.choice("max"));
    gameState.enemy.reset(UI.ENEMY_NAME, CARD.choice("normal"));

    UI.clearLog();
    UI.addLog(CONFIG.GAME_START);

    UI.renderHand(gameState.mine.hand, CONFIG.MINE);
    UI.renderHand(gameState.enemy.hand, CONFIG.ENEMY);

    UI.updatePoint(0, CONFIG.MINE);
    UI.updatePoint(0, CONFIG.ENEMY);

    UI.updateBattleButtons(true);

    UI.addLog(CONFIG.HAND_SET_END);
    UI.updateTurn(gameState.turn);
}

// 勝敗判定
export async function cardJudge(mineCard, enemyCard, mineIndex, enemyIndex) {
    const minePower = applySkill(mineCard, "mine");
    const enemyPower = applySkill(enemyCard, "enemy");

    // 使用済み
    gameState.mine.hand[mineIndex].used = true;
    gameState.enemy.hand[enemyIndex].used = true;

    UI.renderHand(gameState.mine.hand, CONFIG.MINE);
    UI.renderHand(gameState.enemy.hand, CONFIG.ENEMY);

    // 1秒待つ
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (minePower > enemyPower) {
        addPoint(CONFIG.MINE);
    } else if (minePower < enemyPower) {
        addPoint(CONFIG.ENEMY);
    } else {
        alert(CONFIG.CARD_JUDGE_DROW);
        UI.addLog(CONFIG.CARD_JUDGE_DROW);
    }

    // 勝利条件
    if (gameState.mine.point === CONFIG.WIN_POINT ||
        gameState.enemy.point === CONFIG.WIN_POINT) {
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

    const winner = getWinner();
    UI.addLog(
        CONFIG.BATTLE_JUDGE_WIN(
            winner,
            gameState.mine.point,
            gameState.enemy.point
        )
    );

    UI.disableAllHandCards();

    // バトル後：再戦ボタンON、リタイアOFF
    UI.updateBattleButtons(false);
}

// プレイヤーのカード選択 → 判定まで
export function processDecision() {
    const mineIndex = UI.getSelectedMineIndex();
    const mineCard = gameState.mine.hand[mineIndex];

    UI.renderOpenCard(mineCard, CONFIG.MINE);
    UI.addLog(CONFIG.SELECT_CARD(UI.MINE_NAME, mineCard.name));

    const enemyIndex = getRandomEnemyIndex();
    const enemyCard = gameState.enemy.hand[enemyIndex];

    UI.renderOpenCard(enemyCard, CONFIG.ENEMY);
    UI.addLog(CONFIG.SELECT_CARD(UI.ENEMY_NAME, enemyCard.name));

    cardJudge(mineCard, enemyCard, mineIndex, enemyIndex);
}

// リタイア
export function retireBattle() {
    UI.addLog("バトルをリタイアしました。");

    UI.disableAllHandCards();

    UI.updateBattleButtons(false);
}

// 再戦
export function retryBattle() {
    gameState.turn = 1;
    gameState.mine.reset(UI.MINE_NAME, CARD.choice("max"));
    gameState.enemy.reset(UI.ENEMY_NAME, CARD.choice("normal"));

    UI.clearLog();
    UI.addLog(CONFIG.GAME_START_NEW);

    UI.updateTurn(gameState.turn);
    UI.updatePoint(0, CONFIG.MINE);
    UI.updatePoint(0, CONFIG.ENEMY);

    UI.clearOpenArea(CONFIG.MINE);
    UI.clearOpenArea(CONFIG.ENEMY);

    UI.renderHand(gameState.mine.hand, CONFIG.MINE);
    UI.renderHand(gameState.enemy.hand, CONFIG.ENEMY);

    UI.enableAllHandCards();

    // 再戦開始：リタイアON、再戦OFF
    UI.updateBattleButtons(true);
}

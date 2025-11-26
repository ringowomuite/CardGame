import * as CONFIG from "./config.js";
import * as CARD from "./card.js";
import * as UI from "./ui.js";
import { applySkill } from "./skill.js";
import { gameState } from "./stab.js";

// ゲーム開始：手札作成 + UI
export function setupGame() {

    gameState.turn = 1;
    gameState.mine.reset(UI.MINE_NAME, CARD.choice("dice"));
    gameState.enemy.reset(UI.ENEMY_NAME, CARD.choice("normal"));

    UI.renderHand(gameState.mine.hand, CONFIG.MINE);
    UI.renderHand(gameState.enemy.hand, CONFIG.ENEMY);

    UI.addLog(CONFIG.HAND_SET_END);
    UI.addLog(CONFIG.GAME_START);

    initBattleUI();
}

// 初期化共通UI
function initBattleUI(retryFlg) {
    if (retryFlg) {
        UI.clearLog();
    }
    UI.updatePoint(0, CONFIG.MINE);
    UI.updatePoint(0, CONFIG.ENEMY);

    UI.renderOpenCard(null, CONFIG.MINE);
    UI.renderOpenCard(null, CONFIG.ENEMY);

    gameState.turn = 1;
    UI.updateTurn(gameState.turn);

    UI.updateBattleButtons(true);
}

// 決定ボタンから発火するイベント
export async function processDecision() {
    const mineIndex = UI.getSelectedMineIndex();
    const mineCard = gameState.mine.hand[mineIndex];

    UI.renderOpenCard(mineCard, CONFIG.MINE);
    UI.addLog(CONFIG.SELECT_CARD(UI.MINE_NAME, mineCard.name));

    const enemyIndex = getRandomEnemyIndex();
    const enemyCard = gameState.enemy.hand[enemyIndex];

    UI.renderOpenCard(enemyCard, CONFIG.ENEMY);
    UI.addLog(CONFIG.SELECT_CARD(UI.ENEMY_NAME, enemyCard.name));

    // 勝敗判定
    await cardJudge(mineCard, enemyCard, mineIndex, enemyIndex);

    // ターン表示更新
    nextTurn();

    // オープンカードクリア
    UI.renderOpenCard(null, CONFIG.MINE);
    UI.renderOpenCard(null, CONFIG.ENEMY);
}

// 生存している敵カードからランダム選択
function getRandomEnemyIndex() {
    const aliveIndexes = gameState.enemy.hand
        .map((card, i) => (!card.used ? i : null))
        .filter(i => i !== null);

    const rand = Math.floor(Math.random() * aliveIndexes.length);
    return aliveIndexes[rand];
}

// 勝敗判定
export async function cardJudge(mineCard, enemyCard, mineIndex, enemyIndex) {
    // スキルを考慮した攻撃力を取得
    const minePower = applySkill(mineCard, "mine");
    const enemyPower = applySkill(enemyCard, "enemy");

    // 使用したカードの状態を使用済みにし、手札の表示更新
    gameState.mine.hand[mineIndex].used = true;
    gameState.enemy.hand[enemyIndex].used = true;
    UI.renderHand(gameState.mine.hand, CONFIG.MINE);
    UI.renderHand(gameState.enemy.hand, CONFIG.ENEMY);

    // 1秒待つ
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 勝敗判定・ポイント計算
    if (minePower > enemyPower) {
        addPoint(CONFIG.MINE);
    } else if (minePower < enemyPower) {
        addPoint(CONFIG.ENEMY);
    } else {
        alert(CONFIG.CARD_JUDGE_DROW);
        UI.addLog(CONFIG.CARD_JUDGE_DROW);
    }

    // どちらかが3ポイント得る、または全ターン終了
    if (gameState.mine.point === CONFIG.WIN_POINT ||
        gameState.enemy.point === CONFIG.WIN_POINT ||
        gameState.turn === CONFIG.MAX_TURN) {
        endGame();
        return;
    }
}

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

// ターン表示更新
export function nextTurn() {
    gameState.turn++;
    UI.updateTurn(gameState.turn);
}

// ゲーム終了処理
export function endGame(retireFlg = false) {
    UI.addLog(CONFIG.GAME_END);
    if (retireFlg) {
        UI.addLog("バトルをリタイアしました。あなたの負けです。");
    } else {

        const winner = getWinner();
        UI.addLog(
            CONFIG.BATTLE_JUDGE_WIN(
                winner,
                gameState.mine.point,
                gameState.enemy.point
            )
        );
    }
    UI.disableAllHandCards();
    UI.updateBattleButtons(false);
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

// リタイア
export function retireBattle() {
    endGame(true);
}

// 再戦
export function retryBattle() {
    // 手札の初期化
    gameState.mine.reset(UI.MINE_NAME, CARD.choice("dice"));
    gameState.enemy.reset(UI.ENEMY_NAME, CARD.choice("normal"));

    // 手札の表示
    UI.renderHand(gameState.mine.hand, CONFIG.MINE);
    UI.renderHand(gameState.enemy.hand, CONFIG.ENEMY);

    initBattleUI(true);
    UI.addLog(CONFIG.GAME_START_NEW);
}

export const MAX_TURN = 5;
export const HAND_SIZE = 5;
export const WIN_POINT = 3;

export const MINE = "mine";
export const ENEMY = "enemy";

export const INIT_START = "初期化処理開始";
export const INIT_END = "初期化処理終了";
export const GAME_START = "===ゲーム開始===";
export const GAME_END = "===ゲーム終了===";
export const HAND_SET_END = "手札セット完了";

export const CARD_JUDGE_WIN = (playerType) =>
    `${playerType}に1ポイントが入りました。`;
export const CARD_JUDGE_DROW = "引き分けのため、ポイントの変動はありませんでした。";

export const BATTLE_JUDGE_WIN = (playerType, minePoint, enemyPoint) =>
    `${minePoint} 対 ${enemyPoint} で ${playerType} の勝利です。`
export const BATTLE_JUDGE_DROW = (playerType, minePoint, enemyPoint) =>
    `ポイントが引き分けのため、親である ${playerType} の勝利です。`;

export const SELECT_CARD = (playerType, name) =>
    `${playerType} は ${name} を選択しました`;

export const TURN_DISP = (turn) =>
    `======${turn}ターン目=====`;

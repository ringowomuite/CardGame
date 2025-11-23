// 静的定数
export const MAX_TURN = 5;
export const HAND_SIZE = 5;
export const WIN_POINT = 3;

// プレイヤータイプ
export const MINE = "mine";
export const ENEMY = "enemy";

// 処理順出力用
export const INIT_START = "初期化処理開始";
export const INIT_END = "初期化処理終了";
export const GAME_START = "===ゲーム開始===";
export const GAME_END = "===ゲーム終了===";
export const GAME_START_NEW = "=== 新しいバトルを開始 ===";
export const HAND_SET_END = "手札セット完了";
export const CONFIRM_DECISION = "これで決定しますか？";

// バトル中使用
export const CARD_JUDGE_WIN = (playerName) =>
    `${playerName} に1ポイントが入りました。`;

export const CARD_JUDGE_DROW =
    "引き分けのため、ポイントの変動はありませんでした。";

// 勝利判定
export const BATTLE_JUDGE_WIN = (playerName, minePoint, enemyPoint) =>
    `${minePoint} 対 ${enemyPoint} で ${playerName} の勝利です。`;

export const BATTLE_JUDGE_DROW = (playerName, minePoint, enemyPoint) =>
    `ポイントが引き分けのため、親である ${playerName} の勝利です。`;

// オープンカード選択
export const SELECT_CARD = (playerName, name) =>
    `${playerName} は ${name} を選択しました。`;

// 現在ターン数
export const TURN_DISP = (turn) =>
    `======${turn}ターン目=====`;

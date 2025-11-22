import * as CONFIG from "./config.js";
import * as GAME from "./game.js";
import * as UI from "./ui.js";

let text;

document.addEventListener("DOMContentLoaded", async () => {
    UI.addLog(CONFIG.INIT_START);

    // カードクリックイベント作成
    UI.setupMineCardClickEvents();

    // オープンカード選択ボタンイベント作成
    document.getElementById("cardDecision").addEventListener("click", () => {
        if (confirm("これで決定しますか？")) {
            // ▼ 1. 自分のカードを描画
            const mineIndex = UI.getSelectedMineIndex();
            const mineCard = GAME.mineHand[mineIndex];
            UI.renderOpenCard(mineCard, CONFIG.MINE);

            text = "あなたは" + mineCard.name + "を選択しました。";
            UI.addLog(text);

            // ▼ 2. 相手の手札からランダムで選択
            const enemyIndex = getRandomEnemyIndex();
            const enemyCard = GAME.enemyHand[enemyIndex];

            // ▼ 3. 相手カード描画
            UI.renderOpenCard(enemyCard, CONFIG.ENEMY);
            text = "あいては" + enemyCard.name + "を選択しました。";
            UI.addLog(text);

            // ▼ 4. （必要なら）勝敗判定へ
            GAME.cardJudge(mineCard, enemyCard, mineIndex, enemyIndex);
            
        }
    });

    // ここに初期表示・初期設定などを書く
    // await も使える



    // ゲーム開始
    GAME.setupGame();

    UI.addLog(CONFIG.INIT_END);
    UI.addLog(CONFIG.TURN_DISP(GAME.turn));
});

function getRandomEnemyIndex() {
    const aliveIndexes = GAME.enemyHand
        .map((card, index) => card ? index : null)
        .filter(index => index !== null);

    // aliveIndexes が [0, 2, 4] のようになる
    const rand = Math.floor(Math.random() * aliveIndexes.length);
    return aliveIndexes[rand];
}
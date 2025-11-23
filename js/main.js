import * as CONFIG from "./config.js";
import * as GAME from "./game.js";
import * as UI from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
    UI.addLog(CONFIG.INIT_START);

    // カードクリックイベント作成
    UI.setupMineCardClickEvents();

    // オープンカード選択ボタンイベント作成
    document.getElementById("cardDecision").addEventListener("click", () => {
        if (confirm(CONFIG.CONFIRM_DECISION)) {
            GAME.processDecision();
        }
    });

    // ここに初期表示・初期設定などを書く
    // await も使える

    UI.addLog(CONFIG.INIT_END);

    // ゲーム開始
    GAME.setupGame();

    UI.addLog(CONFIG.TURN_DISP(GAME.turn));
});

import * as CONFIG from "./config.js";
import * as GAME from "./game.js";
import * as UI from "./ui.js";
import * as STAB from "./stab.js";

document.addEventListener("DOMContentLoaded", () => {

    UI.addLog(CONFIG.INIT_START);

    // カードクリックイベント
    UI.setupMineCardClickEvents();

    // 決定ボタン
    document.getElementById("cardDecision")
        .addEventListener("click", GAME.processDecision);

    // ★ 再戦ボタン（バトル後のみ有効）
    document.getElementById("retryButton")
        .addEventListener("click", GAME.retryBattle);

    // ★ リタイアボタン（バトル中のみ有効）
    document.getElementById("retireButton")
        .addEventListener("click", GAME.retireBattle);

    UI.addLog(CONFIG.INIT_END);

    // ゲーム開始
    GAME.setupGame();
});

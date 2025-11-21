import * as GAME from "./game.js";
import * as UI from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("初期化処理開始");

    // カードクリックイベント作成
    UI.setupMineCardClickEvents();

    // オープンカード選択ボタンイベント作成
    document.getElementById("cardDecision").addEventListener("click", () => {
        if (confirm("これで決定しますか？")) {
            console.log("決定されました");
        }
    });

    // ここに初期表示・初期設定などを書く
    // await も使える



    // ゲーム開始
    GAME.start();

    console.log("初期化処理完了");
});

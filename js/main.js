import * as GAME from "./game.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("初期化処理開始");

    // ここに初期表示・初期設定などを書く
    // await も使える
    

    console.log("初期化処理完了");

    // ゲーム開始
    GAME.start();
});

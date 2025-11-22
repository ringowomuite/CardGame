import * as CONFIG from "./config.js";
import * as UI from "./ui.js";
import * as GAME from "./game.js";

// 手札5枚をUIに描写する(スタンバイフェーズ)
// 使用できるカードのみを描写
export function renderHand(hand, playerType) {
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        const slot = document.getElementById(`${playerType}Slot${i}`);

        if (!slot) continue;

        if (!card) {
            slot.style.visibility = "hidden";
            slot.classList.remove("selected");
            enableDecisionButton(false);
            continue;
        }

        slot.style.visibility = "visible";

        slot.querySelector(".card-name-area").textContent = card.name;
        slot.querySelector(".base-power-area").textContent = card.base;
        slot.querySelector(".total-power-area").textContent = card.base;
    }
}

// オープンカードを描写する(オープンチョイスフェーズ)
export function renderOpenCard(card, playerType) {
    const key = playerType === CONFIG.MINE ? "Mine" : "Enemy";
    const openCard = document.getElementById(`open${key}Card`);

    openCard.querySelector(".card-name-area").textContent = card.name;
    openCard.querySelector(".base-power-area").textContent = card.base;
    openCard.querySelector(".total-power-area").textContent = card.base;
}

// 次ターンのためにオープンカードを消す
export function clearOpenArea(playerType) {
    const key = playerType === CONFIG.MINE ? "Mine" : "Enemy";
    const openCard = document.getElementById(`open${key}Card`);

    openCard.querySelector(".card-name-area").textContent = "";
    openCard.querySelector(".base-power-area").textContent = "";
    openCard.querySelector(".total-power-area").textContent = "";
}

// ポイント更新
export function updatePoint(point, playerType) {
    // 対象の player-area 内の score を取得
    const scoreArea = document.querySelector(`.${playerType} .score`);
    if (!scoreArea) return;

    const spans = scoreArea.querySelectorAll("span");

    // リセット：全部 ○ に戻す
    spans.forEach(span => span.textContent = "○");

    // 勝利数だけ ● に変える
    for (let i = 0; i < point; i++) {
        if (spans[i]) spans[i].textContent = "●";
    }

    // どちらかのポイントが3でゲーム終了
    if (point === CONFIG.WIN_POINT) {
        GAME.endGame();
        return;
    }
}

// ターン数更新
export function updateTurn(afterTurn) {
    // 全ターン終了でゲーム終了
    if (afterTurn > CONFIG.MAX_TURN) {
        GAME.endGame();
        return;
    }

    let beforeTurnArea = document.getElementById("turn");
    UI.addLog(CONFIG.TURN_DISP(afterTurn));
    beforeTurnArea.textContent = afterTurn;

    clearOpenArea(CONFIG.MINE);
    clearOpenArea(CONFIG.ENEMY);
}

// 自分が選択したカードの添え字
let selectedMineIndex = null;

// 決定ボタンの活性制御
export function enableDecisionButton(enable) {
    const btn = document.getElementById("cardDecision");
    if (enable) {
        btn.disabled = false;
        btn.classList.add("active");
    } else {
        btn.disabled = true;
        btn.classList.remove("active");
    }
}

// カードクリックイベント
export function setupMineCardClickEvents() {
    for (let i = 0; i < 5; i++) {
        const slot = document.getElementById(`mineSlot${i}`);

        slot.addEventListener("click", () => {

            // すでにこのカードが選択されていた → 解除
            if (selectedMineIndex === i) {
                clearMineSelection();
                enableDecisionButton(false);
                return;
            }

            // 新しい選択
            clearMineSelection();
            slot.classList.add("selected");
            selectedMineIndex = i;
            enableDecisionButton(true);
        });
    }
}

// 以前選択していた情報を削除する
export function clearMineSelection() {
    for (let i = 0; i < 5; i++) {
        document.getElementById(`mineSlot${i}`).classList.remove("selected");
    }
    selectedMineIndex = null;
}

export function getSelectedMineIndex() {
    return selectedMineIndex;
}

export function addLog(text) {
    const logBox = document.querySelector(".log-box");
    const p = document.createElement("div");
    p.textContent = text;
    logBox.appendChild(p);

    // スクロールを一番下に
    logBox.scrollTop = logBox.scrollHeight;
}

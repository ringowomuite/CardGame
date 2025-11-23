import * as CONFIG from "./config.js";
import * as UI from "./ui.js";
import * as GAME from "./game.js";
import { applySkill } from "./skill.js";

let mineNameElement = document.getElementById("mineName");
let enemyNameElement = document.getElementById("enemyName");
export const MINE_NAME = mineNameElement.textContent;
export const ENEMY_NAME = enemyNameElement.textContent;

// 手札5枚をUIに描写する(スタンバイフェーズ)
// 使用できるカードのみを描写

export function renderHand(hand, playerType) {
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        const slot = document.getElementById(`${playerType}Slot${i}`);

        if (!slot) continue;

        if (!card) continue; // null は想定しない

        // カード表示（used でも非表示にはしない）
        slot.style.visibility = "visible";

        slot.querySelector(".card-name-area").textContent = card.name;
        // ★ スキル表示（将来の拡張用。今は空欄でもOK）
        slot.querySelector(".card-skill-area").textContent =
            card.skill ? formatSkillText(card.skill) : "";
        slot.querySelector(".base-power-area").textContent = card.base;
        slot.querySelector(".total-power-area").textContent = "";

        // ★ 使用済みなら薄くする
        if (card.used) {
            slot.style.opacity = "0.3";
            slot.style.pointerEvents = "none"; // クリック不可
        } else {
            slot.style.opacity = "1.0";
            slot.style.pointerEvents = "auto";
        }
    }
    clearMineSelection();
}

export function renderOpenCard(card, playerType) {
    const key = playerType === CONFIG.MINE ? "Mine" : "Enemy";
    const openCard = document.getElementById(`open${key}Card`);

    openCard.querySelector(".card-name-area").textContent = card.name;
    // ★ スキル表示（将来の拡張用。今は空欄でもOK）
    openCard.querySelector(".card-skill-area").textContent =
        card.skill ? formatSkillText(card.skill) : "";
    // ◆ 基礎攻撃力
    openCard.querySelector(".base-power-area").textContent = card.base;
    // ★ 合計攻撃力（スキル適用後）
    const total = applySkill(card, playerType);
    openCard.querySelector(".total-power-area").textContent = total;
}

// 次ターンのためにオープンカードを消す
export function clearOpenArea(playerType) {
    const key = playerType === CONFIG.MINE ? "Mine" : "Enemy";
    const openCard = document.getElementById(`open${key}Card`);

    openCard.querySelector(".card-name-area").textContent = "";
    openCard.querySelector(".card-skill-area").textContent = "";
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

}

// ターン数更新
export function updateTurn(afterTurn) {

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
    for (let i = 0; i < CONFIG.HAND_SIZE; i++) {
        document.getElementById(`mineSlot${i}`).classList.remove("selected");
    }
    selectedMineIndex = null;
    enableDecisionButton(false);
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

function formatSkillText(skill) {
    if (skill.plus) return `攻撃力 +${skill.plus}`;
    if (skill.minus) return `攻撃力 -${skill.minus}`;
    return "";
}

export function disableAllHandCards() {
    // 自分の手札
    for (let i = 0; i < CONFIG.HAND_SIZE; i++) {
        const mineSlot = document.getElementById(`mineSlot${i}`);
        if (mineSlot) {
            mineSlot.style.opacity = "0.3";
            mineSlot.style.pointerEvents = "none";
        }
    }

    // 敵の手札（必要なら）
    for (let i = 0; i < CONFIG.HAND_SIZE; i++) {
        const enemySlot = document.getElementById(`enemySlot${i}`);
        if (enemySlot) {
            enemySlot.style.opacity = "0.3";
            enemySlot.style.pointerEvents = "none";
        }
    }

    // 決定ボタンも押せないようにする
    const btn = document.getElementById("cardDecision");
    if (btn) {
        btn.disabled = true;
        btn.classList.remove("active");
    }
}

export function clearLog() {
    document.querySelector(".log-box").innerHTML = "";
}

export function hideRetryButton() {
    document.getElementById("retryButton").style.visibility = "hidden";
}

export function enableAllHandCards() {
    document.querySelectorAll(".mine .card-slot").forEach(el => {
        el.style.opacity = 1;
        el.disabled = false;
        el.classList.remove("used");
    });
}

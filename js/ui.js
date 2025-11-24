import * as CONFIG from "./config.js";
import * as GAME from "./game.js";
import { applySkill } from "./skill.js";

let mineNameElement = document.getElementById("mineName");
let enemyNameElement = document.getElementById("enemyName");
export const MINE_NAME = mineNameElement.textContent;
export const ENEMY_NAME = enemyNameElement.textContent;

// 選択中カード
let selectedMineIndex = null;

// 手札描画
export function renderHand(hand, playerType) {
    hand.forEach((card, i) => {
        const slot = document.getElementById(`${playerType}Slot${i}`);
        if (!slot) return;

        setHandSlot(slot, card);

        // 使用済みなら非活性
        if (card.used) {
            slot.style.opacity = "0.3";
            slot.style.pointerEvents = "none";
        } else {
            slot.style.opacity = "1.0";
            slot.style.pointerEvents = "auto";
        }
    });

    clearMineSelection();
}

// 手札の添え字番目にカードをセットする
function setHandSlot(slot, card) {
    slot.style.visibility = "visible";
    
     // レアリティ反映
     slot.classList.remove("star1","star2","star3","star4","star5");
     if (card.star) slot.classList.add("star" + card.star);

    slot.querySelector(".card-name-area").textContent = card.name;
    slot.querySelector(".card-skill-area").textContent =
        card.skill ? formatSkillText(card.skill) : "";
    slot.querySelector(".base-power-area").textContent = card.base;

    // 開いてない状態なので total は空欄
    slot.querySelector(".total-power-area").textContent = "";
}

// オープンカード描写
export function renderOpenCard(card, playerType) {
    const key = playerType === CONFIG.MINE ? "Mine" : "Enemy";
    const openCard = document.getElementById(`open${key}Card`);

    // レアリティ反映
    openCard.classList.remove("no-hover","star1","star2","star3","star4","star5");
    openCard.classList.add("star" + card.star);

    setOpenCardFields(openCard, card, playerType);
}

// オープンカード消去
export function clearOpenArea(playerType) {
    const key = playerType === CONFIG.MINE ? "Mine" : "Enemy";
    const openCard = document.getElementById(`open${key}Card`);

    openCard.classList.add("no-hover");
    openCard.classList.remove("star1","star2","star3","star4","star5");

    setOpenCardFields(openCard, null, playerType);
}

// ポイント更新
export function updatePoint(point, playerType) {
    const scoreArea = document.querySelector(`.${playerType} .score`);
    if (!scoreArea) return;

    const spans = scoreArea.querySelectorAll("span");
    spans.forEach(span => span.textContent = "○");

    for (let i = 0; i < point; i++) {
        if (spans[i]) spans[i].textContent = "●";
    }
}

// ターン更新
export function updateTurn(afterTurn) {
    let beforeTurnArea = document.getElementById("turn");
    addLog(CONFIG.TURN_DISP(afterTurn));
    beforeTurnArea.textContent = afterTurn;

    clearOpenArea(CONFIG.MINE);
    clearOpenArea(CONFIG.ENEMY);
}

// カードクリック
export function setupMineCardClickEvents() {
    for (let i = 0; i < CONFIG.HAND_SIZE; i++) {
        const slot = document.getElementById(`mineSlot${i}`);

        slot.addEventListener("click", () => {
            if (selectedMineIndex === i) {
                clearMineSelection();
                hideActionArea();
                return;
            }

            clearMineSelection();
            slot.classList.add("selected");
            selectedMineIndex = i;

            showActionArea();
            enableDecisionButton(true);
        });
    }
}

// 選択解除
export function clearMineSelection() {
    for (let i = 0; i < CONFIG.HAND_SIZE; i++) {
        const slot = document.getElementById(`mineSlot${i}`);
        slot.classList.remove("selected");
    }

    selectedMineIndex = null;
    enableDecisionButton(false);
    hideActionArea();
}

export function getSelectedMineIndex() {
    return selectedMineIndex;
}

// ログ
export function addLog(text) {
    const logBox = document.querySelector(".log-box");
    const p = document.createElement("div");
    p.textContent = text;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
}

// スキルテキスト
function formatSkillText(skill) {
    if (skill.plus) return `攻撃力 +${skill.plus}`;
    if (skill.minus) return `攻撃力 -${skill.minus}`;
    return "";
}

// 全カード無効化
export function disableAllHandCards() {
    document.querySelectorAll(".hand-slot").forEach(slot => {
        setCardSlotEnabled(slot, false);
    });

    enableDecisionButton(false);
}

// 再戦時、手札を活性にする
export function enableAllHandCards() {
    document.querySelectorAll(".mine .hand-slot").forEach(slot => {
        setCardSlotEnabled(slot, true);
        slot.classList.remove("used");
    });
}

// ログクリア
export function clearLog() {
    document.querySelector(".log-box").innerHTML = "";
}

// 再戦ボタン非表示
export function hideRetryButton() {
    document.getElementById("retryButton").style.visibility = "hidden";
}

// アクション表示
export function showActionArea(type = "card") {
    if (type === "card") {
        toggleActionArea(true, CONFIG.CARD_DECISION);
    }
}

// アクション非表示
export function hideActionArea() {
    toggleActionArea(false);
}

// 決定ボタン
export function enableDecisionButton(enable) {
    const btn = document.getElementById("cardDecision");
    btn.disabled = !enable;
    btn.classList.toggle("active", enable);
}

// 汎用：オープンカード文字設定
function setOpenCardFields(openCard, card, playerType) {
    const isClear = !card;

    openCard.querySelector(".card-name-area").textContent =
        isClear ? "" : card.name;

    openCard.querySelector(".card-skill-area").textContent =
        isClear ? "" : (card.skill ? formatSkillText(card.skill) : "");

    openCard.querySelector(".base-power-area").textContent =
        isClear ? "" : card.base;

    openCard.querySelector(".total-power-area").textContent =
        isClear ? "" : applySkill(card, playerType);
}

function setCardSlotEnabled(slot, enabled) {
    slot.style.opacity = enabled ? "1.0" : "0.3";
    slot.style.pointerEvents = enabled ? "auto" : "none";
}

function toggleActionArea(show, text = "") {
    const area = document.querySelector(".battle-left-area");
    const textArea = document.getElementById("actionTextArea");

    textArea.textContent = show ? text : "";
    area.style.visibility = show ? "visible" : "hidden";
}

export function setRetryEnabled(enabled) {
    document.getElementById("retryButton").disabled = !enabled;
}

export function setRetireEnabled(enabled) {
    document.getElementById("retireButton").disabled = !enabled;
}

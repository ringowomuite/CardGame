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
            setCardSlotEnabled(slot, false);
        } else {
            setCardSlotEnabled(slot, true);
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

    openCard.classList.remove("star1","star2","star3","star4","star5");
    // cardがnullの場合、オープンカードをクリアする
    if (!card) {
        openCard.classList.add("no-hover");
    } else {
        // レアリティ反映
        openCard.classList.remove("no-hover");
        openCard.classList.add("star" + card.star);
    }
    setOpenCardFields(openCard, card, playerType);
}

// オープンカード文字設定
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

// カードクリック
export function setupMineCardClickEvents() {
    for (let i = 0; i < CONFIG.HAND_SIZE; i++) {
        const slot = document.getElementById(`mineSlot${i}`);

        slot.addEventListener("click", () => {
            // 同じカードの場合、選択解除してボタン非活性
            if (selectedMineIndex === i) {
                clearMineSelection();
                toggleActionArea(false);
                return;
            }

            clearMineSelection();
            slot.classList.add("selected");
            selectedMineIndex = i;

            toggleActionArea(true);
            toggleDecisionButton(true);
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
    toggleActionArea(false);
    toggleDecisionButton(false);
}

// 全カード無効化
export function disableAllHandCards() {
    document.querySelectorAll(".hand-slot").forEach(slot => {
        setCardSlotEnabled(slot, false);
    });

    clearMineSelection();
    toggleDecisionButton(false);
}

// カードの活性状態に応じてスタイル変更
function setCardSlotEnabled(slot, enabled) {
    slot.style.opacity = enabled ? "1.0" : "0.3";
    slot.style.pointerEvents = enabled ? "auto" : "none";
}

// 決定ボタン表示制御
export function toggleDecisionButton(enable) {
    const btn = document.getElementById("cardDecision");
    btn.disabled = !enable;
    btn.classList.toggle("active", enable);
}

// アクションエリア表示制御
function toggleActionArea(show, type = "card") {
    let text = "";
    if (type === "card") {
        text = CONFIG.CARD_DECISION;
    }
    const area = document.querySelector(".battle-left-area");
    const textArea = document.getElementById("actionTextArea");

    textArea.textContent = show ? text : "";
    area.style.visibility = show ? "visible" : "hidden";
}

// バトル中ならリタイアボタン、バトル外なら再戦ボタンを活性とする
export function updateBattleButtons(isBattle) {
    document.getElementById("retryButton").disabled = isBattle;
    document.getElementById("retireButton").disabled = !isBattle;
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
}

// 選択中の手札の添え字を返却
export function getSelectedMineIndex() {
    return selectedMineIndex;
}

// スキルテキスト
function formatSkillText(skill) {
    return skill.text ? skill.text : "";
}

// ログ
export function addLog(text) {
    const logBox = document.querySelector(".log-box");
    const p = document.createElement("div");
    p.textContent = text;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
}

// ログクリア
export function clearLog() {
    document.querySelector(".log-box").innerHTML = "";
}
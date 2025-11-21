// 手札5枚をUIに描写する(スタンバイフェーズ)
// 使用できるカードのみを描写
export function renderHand(hand, playerType) {
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        const slot = document.getElementById(`${playerType}Slot${i}`);

        if (!slot) continue;

        if (!card) {
            slot.style.visibility = "hidden";
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

}

// 次ターンのためにオープンカードを消す
export function clearOpenArea() {

}

// スコア更新
export function updateScore(score, playerType) {

}

// ターン数更新
export function updateTurn(turn) {

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

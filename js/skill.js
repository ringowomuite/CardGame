// skill.js
export function applySkill(card, userType, mineState, enemyState) {
    if (!card.skill) return card.base;

    const s = card.skill;
    let power = card.base;

    // 対象プレイヤーの判定
    const isMine = (userType === "mine");
    const targetIsMine = (s.target_player === "mine");

    // 対象が自分か相手かを決定
    const isTargetMine = (isMine === targetIsMine);

    // 今回は openCard のみ
    if (s.target_card !== "openCard") return power;

    // buff（四則演算対応）
    if (s.type === "buff") {
        if (s.plus) power += s.plus;
        if (s.minus) power -= s.minus;
        if (s.multi) power *= s.multi;
        if (s.division) power /= s.division;
    }

    return Math.floor(power);
}

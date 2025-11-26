// skill.js

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function applySkill(card, userType) {
    if (!card || !card.skill) return card.base;

    const skill = card.skill;

    // --- 新形式 steps ---
    if (Array.isArray(skill.steps)) {

        let power = card.base;

        // ★ カードに乱数キャッシュを保持させる
        if (!card._rng) card._rng = {};   // 乱数保管用のオブジェクト

        for (const step of skill.steps) {

            // ---- 条件 (ラッキーのみ) ----
            if (step.if) {
                const cond = step.if;
                if (cond.variable === "dice" && cond.condition === "even") {

                    // ★ dice の値をキャッシュして、同じ値を使う
                    if (card._rng["ifDice"] == null) {
                        card._rng["ifDice"] = randInt(cond.min, cond.max);
                    }
                    const d = card._rng["ifDice"];

                    if (d % 2 !== 0) continue;
                }
            }

            let value = 0;

            // ---- dice（全サイコロ共通）----
            if (step.variable === "dice") {

                // ★ dice の値を乱数キャッシュから取得
                if (card._rng["dice"] == null) {
                    card._rng["dice"] = randInt(step.min, step.max);
                }

                value = card._rng["dice"];
            }

            // ---- 固定値 ----
            else if (step.value != null) {
                value = step.value;
            }

            // ---- 演算 ----
            switch (step.op) {
                case "add": power += value; break;
                case "sub": power -= value; break;
                case "mul": power *= value; break;
                case "div": power /= value; break;
            }
        }

        return Math.floor(power);
    }

    // --- 旧形式（今は未使用） ---
    return card.base;
}

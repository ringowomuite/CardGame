export const decks = {

  normal: [
    {
      name: "シングルああああああああ",
      base: 1,
      star: 1,
      skill: {
        type: "buff",
        steps: [
          { op: "add", value: 1 }
        ],
        text: "攻撃力 + 1",
      }
    },

    {
      name: "ダブル",
      base: 2,
      star: 2,
      skill: {
        type: "buff",
        steps: [
          { op: "add", value: 2 }
        ],
        text: "攻撃力 + 2",
      }
    },

    {
      name: "トリプル",
      base: 3,
      star: 3,
      skill: {
        type: "buff",
        steps: [
          { op: "add", value: 3 }
        ],
        text: "攻撃力 + 3",
      }
    },

    {
      name: "クアドラプル",
      base: 4,
      star: 4,
      skill: {
        type: "buff",
        steps: [
          { op: "add", value: 4 }
        ],
        text: "攻撃力 + 4",
      }
    },

    {
      name: "クインタプル",
      base: 5,
      star: 5,
      skill: {
        type: "buff",
        steps: [
          { op: "add", value: 5 }
        ],
        text: "攻撃力 + 5",
      }
    }
  ],

  max: [
    { name: "セクスタプル", base: 6, star: 3 },
    { name: "セクスタプル", base: 6, star: 3 },
    { name: "セクスタプル", base: 6, star: 3 },
    { name: "セクスタプル", base: 6, star: 3 },
    { name: "セクスタプル", base: 6, star: 3 },
  ],

  // --------------------------------------------------
  // ★ここから下が「追加だけ」した var2 デッキ
  // --------------------------------------------------

  dice: [
    {
      name: "サイコロ",
      base: 0,
      star: 1,
      skill: {
        type: "buff",
        steps: [
          { op: "add", variable: "dice", min: 1, max: 6 }
        ],
        text: "ダイス(1~6)\n攻撃力 + ダイス",
      }
    },
    {
      name: "リスキーサイコロ",
      base: 4,
      star: 2,
      skill: {
        type: "buff",
        steps: [
          { op: "add", variable: "dice", min: -4, max: 4 }
        ],
        text: "ダイス(-4~4)\n攻撃力 + ダイス",
      }
    },
    {
      name: "フェイトサイコロ",
      base: 2,
      star: 3,
      skill: {
        type: "buff",
        steps: [
          { op: "mul", variable: "dice", min: 1, max: 4 }
        ],
        text: "ダイス(1~4)\n攻撃力 * ダイス",
      }
    },
    {
      name: "ラッキーサイコロ",
      base: 6,
      star: 4,
      skill: {
        type: "buff",
        steps: [
          {
            if: { variable: "dice", min: 1, max: 6, condition: "even" },
            op: "add",
            value: 3
          }
        ],
        text: "ダイス(1~6)\nダイスが偶数なら、\n攻撃力 + 3",
      }
    },
    {
      name: "エンジェルサイコロ",
      base: 9,
      star: 5,
      skill: {
        type: "buff",
        steps: [
          { op: "add", variable: "dice", min: -3, max: 3 }
        ],
        text: "ダイス(-3~3)\n攻撃力 * ダイス",
      }
    },
  ],

  laser: [
    {
      name: "レーザーポインター",
      base: 2,
      star: 1,
      skill: {
        type: "buff",
        steps: [
          {
            if: { variable: "enemyBase", condition: "<=", value: 3 },
            op: "add",
            value: 2
          }
        ]
      }
    },
    {
      name: "レーザーバウンサー",
      base: 2,
      star: 2,
      skill: {
        type: "buff",
        steps: [
          { op: "mul", variable: "turn", max: 6 }
        ]
      }
    },
    {
      name: "レーザーランチャー",
      base: 0,
      star: 3,
      skill: {
        type: "buff",
        steps: [
          { op: "add", value: 6 }
        ]
      }
    },
    {
      name: "レーザービーム",
      base: 4,
      star: 4,
      skill: {
        type: "buff",
        steps: [
          { op: "add", variable: "turn" }
        ]
      }
    },
    {
      name: "レーザーパルス",
      base: 6,
      star: 5,
      skill: {
        type: "buff",
        steps: [
          { op: "add", variable: "hand" }
        ]
      }
    },
  ]

};


// デッキ複製（あなたの元のまま）
export function choice(deckName) {
  return decks[deckName].map(c => ({ ...c }));
}

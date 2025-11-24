export const decks = {
 normal: [
  {
    id: 1, name: "シングルああああああああ", base: 1, type: "none", star: 1,
    skill: {
      target_player: "mine",
      target_card: "openCard",
      type: "buff",
      variable: "base",
      plus: 1
    }
  },
  {
    id: 2, name: "ダブル", base: 2, type: "none", star: 1,
    skill: {
      target_player: "mine",
      target_card: "openCard",
      type: "buff",
      variable: "base",
      plus: 1
    }
  },
  {
    id: 3, name: "トリプル", base: 3, type: "none", star: 2,
    skill: {
      target_player: "mine",
      target_card: "openCard",
      type: "buff",
      variable: "base",
      plus: 1
    }
  },
  {
    id: 4, name: "クアドラプル", base: 4, type: "none", star: 2,
    skill: {
      target_player: "mine",
      target_card: "openCard",
      type: "buff",
      variable: "base",
      plus: 1
    }
  },
  {
    id: 5, name: "クインタプル", base: 5, type: "none", star: 3,
    skill: {
      target_player: "mine",
      target_card: "openCard",
      type: "buff",
      variable: "base",
      plus: 1
    }
  },
],

max: [
  { id: 1, name: "セクスタプル", base: 6, type: "none", star: 3, },
  { id: 2, name: "セクスタプル", base: 6, type: "none", star: 3, },
  { id: 3, name: "セクスタプル", base: 6, type: "none", star: 3, },
  { id: 4, name: "セクスタプル", base: 6, type: "none", star: 3, },
  { id: 5, name: "セクスタプル", base: 6, type: "none", star: 3, },
],

};

export function choice(deckName) {
    return decks[deckName].map(c => ({ ...c }));
}
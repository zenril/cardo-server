import { Card, Deck } from ".prisma/client";

export enum Suit {
  ACORNS = "acorns",
  BELLS = "bells",
  CLUBS = "clubs",
  COINS = "coins",
  CUPS = "cups",
  DIAMONDS = "diamonds",
  EYES = "eyes",
  HEARTS = "hearts",
  LEAVES = "leaves",
  REDSTARS = "redstars",
  RODS = "rods",
  ROSES = "roses",
  SHIELDS = "shields",
  SPADES = "spades",
  STARBURST = "starburst",
  STARS = "stars",
  SWORDS = "swords",
}

export type DeckSuitData = {
  cards: string;
  added: number;
  suit: string;
};

export type DeckData = {
  id?: number;
  uuid?: string;
  name: string;
  suits: DeckSuitData[];
};

export interface GameRequestBody {
  deck: number;
  name: string;
}

export let splitCards = (cards: string): string[] => {
  let tokenCards = cards
    .split(/[,\n\s]+/)
    .filter((item) => !!item)
    .map((card) => card.trim());

  return tokenCards;
};

export const verifyCards = (cards: string) => {
  let tokenCards = splitCards(cards);
  for (const card of tokenCards) {
    if (!card || !/^(1[0-3]|[1-9]|[a-z]|[A-Z])$/.test(card)) {
      return false;
    }
  }
  return true;
};

export const verifyDeck = (deck: DeckData) => {
  for (const suit of deck.suits) {
    if (!verifyCards(suit.cards)) {
      return false;
    }
  }

  return true;
};

export const buildGameDeck = (deck: Deck) => {
  let gameDeck: Partial<Card>[] = [];

  for (const suit of deck.suits as DeckSuitData[]) {
    let cards = splitCards(suit.cards);
    for (const card of cards) {
      gameDeck.push({
        name: card,
        type: suit.suit,
      });
    }
  }

  // for (const suit of keys) {
  //   for (const card of deck[suit]) {
  //     cards.push({
  //       name: card,
  //       type: suit,
  //     });
  //   }
  // }

  return gameDeck;
};

export enum GameName {
  classic = "Auto Generated Classic Game",
}

export enum DeckName {
  classic = "Auto Generated Classic Deck",
}

export const cardSets = {
  classic: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"],
};

export const defaultDeck = (): Partial<DeckData> => {
  return {
    name: DeckName.classic,
    suits: [
      {
        suit: "diamonds",
        added: 1,
        cards: cardSets.classic.join(", "),
      },
      {
        suit: "hearts",
        added: 1,
        cards: cardSets.classic.join(", "),
      },
      {
        suit: "clubs",
        added: 1,
        cards: cardSets.classic.join(", "),
      },
      {
        suit: "spades",
        added: 1,
        cards: cardSets.classic.join(", "),
      },
    ],
  };
};

export function getSplitCards(cards: any[], selectedCardId: string | null) {
    if (!selectedCardId) return { cardsDone: [], cardsLeft: cards }
    const selectedCardIndex = cards.indexOf(selectedCardId)
    const cardsDone = cards.slice(0, selectedCardIndex)
    const cardsLeft = cards.slice(selectedCardIndex + 1)
    return { cardsDone, cardsLeft }
}

export function getCompleteCards(currentCard: any, cardsDone: any[], cardsLeft: any[]) {
    return cardsDone.concat(currentCard).concat(cardsLeft)
}

export function sortCards(cards: any[] | null) {
    if (!cards) return null
    return cards.sort((a, b) => a.order_number - b.order_number)
}

export function resplitCards(index: number, cards: any[]) {
    const currCard = cards[index]
    const cardsDone = cards.slice(0, index)
    const cardsLeft = cards.slice(index + 1)
    return { currCard, cardsDone, cardsLeft }
}

export function cardObjectToString(card: any) {
    return card.question
}

export function cardObjectsToStrings(cards: any[]) {
    return cards.map((card) => cardObjectToString(card))
}

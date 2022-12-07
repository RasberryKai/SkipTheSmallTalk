import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CardState } from "../types"
import { getCompleteCards, resplitCards } from "../functions/cardCalculations"

export interface GameState {
    gameId: string | null | undefined
    deckId: string | null | undefined
    levelId: string | null | undefined
    level: number | null | undefined
    levelGameId: string | null | undefined
    currentCard: string | null | undefined
    cardsDone: any[]
    cardsLeft: any[]
    cardIds: any[]
}

const initialState: GameState = {
    gameId: null,
    deckId: null,
    levelId: null,
    level: null,
    currentCard: null,
    levelGameId: null,
    cardsDone: [],
    cardsLeft: [],
    cardIds: [],
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        selectGame(state, action: PayloadAction<string>) {
            state.gameId = action.payload
        },
        selectDeck(state, action: PayloadAction<string>) {
            state.deckId = action.payload
        },
        selectLevel(state, action: PayloadAction<string>) {
            state.levelId = action.payload
        },
        selectLevelNumber(state, action: PayloadAction<number>) {
            state.level = action.payload
        },
        selectLevelGame(state, action: PayloadAction<string>) {
            state.levelGameId = action.payload
        },
        setCardState(state, action: PayloadAction<CardState>) {
            state.currentCard = action.payload.selectedCard
            state.cardsDone = action.payload.cardsDone
            state.cardsLeft = action.payload.cardsLeft
        },
        setCardIds(state, action: PayloadAction<any[]>) {
            state.cardIds = action.payload
        },
        nextCard(state) {
            const currCard = state.currentCard
            state.currentCard = state.cardsLeft.shift()
            state.cardsDone.push(currCard)
        },
        previousCard(state) {
            const currCard = state.currentCard
            state.currentCard = state.cardsDone.pop()
            state.cardsLeft.unshift(currCard)
        },
        jumpToCard(state, action: PayloadAction<number>) {
            const cardArr = getCompleteCards(state.currentCard, state.cardsDone, state.cardsLeft)
            const { currCard, cardsDone, cardsLeft } = resplitCards(action.payload, cardArr)
            state.currentCard = currCard
            state.cardsDone = cardsDone
            state.cardsLeft = cardsLeft
        },
        clearGame(state) {
            state.gameId = null
            state.deckId = null
            state.levelId = null
            state.levelGameId = null
            state.currentCard = null
            state.cardsDone = []
            state.cardsLeft = []
            state.cardIds = []
        },
    },
})

export const {
    selectGame,
    selectDeck,
    selectLevel,
    selectLevelNumber,
    selectLevelGame,
    setCardState,
    setCardIds,
    nextCard,
    previousCard,
    jumpToCard,
    clearGame,
} = gameSlice.actions

export default gameSlice.reducer

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CardState, wildcard } from "../types"
import { getCompleteCards, resplitCards } from "../functions/cardCalculations"

export interface GameState {
    level: number | null // yes
    levelGameId: wildcard // yes
    currentCard: wildcard // yes
    cardsDone: any[] // yes
    cardsLeft: any[] // yes
    cardIds: any[] // yes
}

const initialState: GameState = {
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
        selectLevelNumber(state, action: PayloadAction<number | null>) {
            state.level = action.payload
        },
        selectLevelGame(state, action: PayloadAction<wildcard>) {
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
            state.levelGameId = null
            state.currentCard = null
            state.cardsDone = []
            state.cardsLeft = []
            state.cardIds = []
        },
    },
})

export const { selectLevelNumber, selectLevelGame, setCardState, setCardIds, nextCard, previousCard, jumpToCard, clearGame } =
    gameSlice.actions

export default gameSlice.reducer

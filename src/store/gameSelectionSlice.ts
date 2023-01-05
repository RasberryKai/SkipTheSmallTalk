import { wildcard } from "../types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface GameSelectionState {
    gameId: wildcard
    deckId: wildcard
    levelId: wildcard
}

const initialState: GameSelectionState = {
    gameId: null,
    deckId: null,
    levelId: null,
}

export const gameSelectionSlice = createSlice({
    name: "gameSelection",
    initialState,
    reducers: {
        selectGame(state, action: PayloadAction<wildcard>) {
            state.gameId = action.payload
        },
        selectDeck(state, action: PayloadAction<wildcard>) {
            state.deckId = action.payload
        },
        selectLevel(state, action: PayloadAction<wildcard>) {
            state.levelId = action.payload
        },
        clearGameSelection(state) {
            state.gameId = null
            state.deckId = null
            state.levelId = null
        },
    },
})

export const { selectGame, selectDeck, selectLevel } = gameSelectionSlice.actions

export default gameSelectionSlice.reducer

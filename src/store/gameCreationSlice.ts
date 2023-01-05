import { wildcard } from "../types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface GameCreationState {
    gameId: wildcard
    gameName: wildcard
}

const initialState: GameCreationState = {
    gameId: null,
    gameName: null,
}

export const gameCreationSlice = createSlice({
    name: "gameCreation",
    initialState,
    reducers: {
        updateGameCreationId(state: GameCreationState, action: PayloadAction<wildcard>) {
            state.gameId = action.payload
        },
        updateGameCreationName(state: GameCreationState, action: PayloadAction<wildcard>) {
            state.gameName = action.payload
        },
    },
})

export const { updateGameCreationId, updateGameCreationName } = gameCreationSlice.actions
export default gameCreationSlice.reducer

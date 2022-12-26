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
        selectGameCreationId(state: GameCreationState, action: PayloadAction<wildcard>) {
            state.gameId = action.payload
        },
        selectGameCreationName(state: GameCreationState, action: PayloadAction<wildcard>) {
            state.gameName = action.payload
        },
    },
})

export const { selectGameCreationId, selectGameCreationName } = gameCreationSlice.actions
export default gameCreationSlice.reducer

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DisplayGame, UserUpdate } from "../types"
import { supabase } from "../lib/Supabase"

export interface UserState {
    loggedIn: boolean
    games: DisplayGame[]
    id: string | null | undefined
    email: string | null | undefined
    username: string | null | undefined
}

const initialState: UserState = {
    loggedIn: false,
    games: [],
    id: null,
    email: null,
    username: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logIn(user, action: PayloadAction<UserUpdate>) {
            user.loggedIn = true
            user.id = action.payload.id
            user.email = action.payload.email
            user.username = action.payload.username
        },
        updateGames(user, action: PayloadAction<DisplayGame[]>) {
            user.games = action.payload
        },
        updateUser(user, action: PayloadAction<UserUpdate>) {
            user.id = action.payload.id
            user.email = action.payload.email
            user.username = action.payload.username
        },
        logOut(user) {
            user.loggedIn = false
            user.id = null
            user.email = null
            user.username = null
            user.games = []
            supabase.auth.signOut()
        },
    },
})

export const { logIn, logOut, updateGames, updateUser } = userSlice.actions

export default userSlice.reducer

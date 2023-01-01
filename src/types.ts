import { GameState } from "./store/gameSlice"
import { UserState } from "./store/userSlice"
import { GameCreationState } from "./store/gameCreationSlice"

// Redux
export type RootState = { game: GameState; user: UserState; gameCreation: GameCreationState }

export type UserUpdate = {
    id: string
    email: string
    username: string
}

export type CardState = {
    selectedCard: string | null
    cardsDone: string[]
    cardsLeft: string[]
}

export type wildcard = string | null | undefined

// Components
export type DisplayGame = {
    id: string
    name: string
    owner: string
    players: string[]
    percentage: number
}

export type DynamicInput = {
    type: "user" | "name"
    value: string | undefined
}

export type SelectionCardInfo = {
    id: string
    name: string
    description: string
    levelNumber?: number
}

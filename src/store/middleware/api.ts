import { Dispatch, MiddlewareAPI } from "@reduxjs/toolkit"
import { supabase } from "../../lib/Supabase"
import { getCompleteCards, getNextCardId, getPreviousCardId } from "../../functions/cardCalculations"
import { dbTables } from "../../constants/keys"
import { RootState } from "../../types"

export const api = (api: MiddlewareAPI) => (next: Dispatch) => (action: any) => {
    const handleAction: { [key: string]: (state: any) => void } = {
        "game/nextCard": (state: RootState) => {
            const currentCardId = getNextCardId(
                getCompleteCards(state.game.currentCard, state.game.cardsDone, state.game.cardsLeft),
                state.game.cardIds,
                state.game.currentCard
            )
            supabase.from(dbTables.levelGames).update({ selected_card: currentCardId }).eq("id", state.game.levelGameId)
        },
        "game/previousCard": (state: any) => {
            const currentCardId = getPreviousCardId(
                getCompleteCards(state.game.currentCard, state.game.cardsDone, state.game.cardsLeft),
                state.game.cardIds,
                state.game.currentCard
            )
            supabase.from(dbTables.levelGames).update({ selected_card: currentCardId }).eq("id", state.game.levelGameId)
        },
        "game/jumpToCard": (state: any) => {
            const currentCardId = state.game.cardIds[action.payload]
            supabase.from(dbTables.levelGames).update({ selected_card: currentCardId }).eq("id", state.game.levelGameId)
        },
    }
    if (handleAction[action.type]) {
        const state = api.getState()
        handleAction[action.type](state)
    }
    return next(action)
}

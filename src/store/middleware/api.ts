import { Dispatch, MiddlewareAPI } from "@reduxjs/toolkit"
import { supabase } from "../../lib/Supabase"
import { getCompleteCards } from "../../functions/cardCalculations"

export const api = (api: MiddlewareAPI) => (next: Dispatch) => (action: any) => {
    const handleAction: { [key: string]: (state: any) => void } = {
        "game/nextCard": (state: any) => {
            const combineCards = getCompleteCards(state.game.currentCard, state.game.cardsDone, state.game.cardsLeft)
            const nextCard = state.game.cardsLeft[0]
            const index = combineCards.indexOf(nextCard)
            const currentCard = state.game.cardIds[index]
            supabase.from("levelGame").update({ selected_card: currentCard }).eq("id", state.game.levelGameId)
        },
        "game/previousCard": (state: any) => {
            const combineCards = getCompleteCards(state.game.currentCard, state.game.cardsDone, state.game.cardsLeft)
            const previousCard = state.game.cardsDone[state.game.cardsDone.length - 1]
            const index = combineCards.indexOf(previousCard)
            const currentCard = state.game.cardIds[index]
            supabase.from("levelGame").update({ selected_card: currentCard }).eq("id", state.game.levelGameId)
        },
        "game/jumpToCard": (state: any) => {
            const currentCard = state.game.cardIds[action.payload]
            supabase.from("levelGame").update({ selected_card: currentCard }).eq("id", state.game.levelGameId)
        },
    }
    if (handleAction[action.type]) {
        const state = api.getState()
        handleAction[action.type](state)
    }
    return next(action)
}

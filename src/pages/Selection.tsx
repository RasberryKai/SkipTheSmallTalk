import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { supabase } from "../lib/Supabase"
import SelectionCard from "../components/selection/SelectionCard"
import { RootState, SelectionCardInfo } from "../types"
import { showNotification } from "@mantine/notifications"
import { cardObjectsToStrings, getSplitCards } from "../functions/cardCalculations"
import { getCard, getCards } from "../api/cards"
import { dbTables } from "../constants/keys"
import SelectionHeader from "../components/selection/SelectionHeader"
import AppContainer from "../components/common/AppContainer"
import { updateDeck, updateLevel } from "../store/gameSelectionSlice"
import { updateCardIds, updateCardState, updateLevelGame, updateLevelNumber } from "../store/gameSlice"

export default function Selection() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const gameId = useSelector((state: RootState) => state.gameSelection.gameId)
    const deckId = useSelector((state: RootState) => state.gameSelection.deckId)
    const levelId = useSelector((state: RootState) => state.gameSelection.levelId)
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn)

    const [displayedItems, setDisplayedItems] = useState<SelectionCardInfo[]>([])

    const renderDecks = async () => {
        const { data, error } = await supabase.from(dbTables.decks).select("*")
        if (error) {
            console.log("Error while getting decks: ", error)
            return
        }
        if (!data || data.length === 0) {
            console.log("No decks found")
            return
        }
        setDisplayedItems([])
        data.forEach((deck: any) => {
            const { id, name, description } = deck
            setDisplayedItems((prev) => [...prev, { id, name, description }])
        })
    }

    const renderLevels = async () => {
        const { data, error } = await supabase
            .from(dbTables.levels)
            .select("*")
            .eq("deck", deckId)
            .order("level_number", { ascending: true })
        if (error) {
            console.log("Error while getting games: ", error)
            return
        }
        if (!data || data.length === 0) {
            console.log("No levels found")
            return
        }
        setDisplayedItems([])
        data.forEach((level: any) => {
            const { id, level_number, description } = level
            setDisplayedItems((prev) => [...prev, { id, name: level_number, description }])
        })
    }

    const initialiseGame = async () => {
        if (!levelId) {
            showNotification({
                title: "Error",
                message: "No level selected, please select a level",
                color: "red",
            })
            return
        }
        // no user mode dispatch cards for this level
        if (!loggedIn) {
            let cards = await getCards(levelId)
            if (!cards) {
                showNotification({
                    title: "Error",
                    message: "No cards found for this level",
                    color: "red",
                })
                return
            }
            cards = cards.map((card) => card.question)
            const { cardsDone, cardsLeft } = getSplitCards(cards, null)
            dispatch(updateCardState({ selectedCard: cardsLeft.shift(), cardsDone, cardsLeft }))
            navigate("/play")
            return
        }
        const { data, error } = await supabase
            .from(dbTables.levelGames)
            .select("*")
            .eq("game", gameId)
            .eq("deck", deckId)
            .eq("level", levelId)
        if (error) {
            console.log(`Error while checking for existing levelGame: ${error}`)
            showNotification({
                title: "Error",
                message: "Error while checking for existing levelGame",
                color: "red",
            })
            return
        }
        if (!levelId) {
            showNotification({
                title: "Error",
                message: "No level selected",
                color: "red",
            })
            return
        }
        let cards = await getCards(levelId)
        if (!cards) {
            showNotification({
                title: "Error",
                message: "Error while getting cards",
                color: "red",
            })
            return
        }
        dispatch(updateCardIds(cards.map((card) => card.id)))
        cards = cardObjectsToStrings(cards)
        if (data && data.length > 0) {
            await dispatch(updateLevelGame(data[0].id))
            const selectedCardId = data[0].selected_card
            let selectedCard = await getCard(selectedCardId)
            if (selectedCard) selectedCard = selectedCard.question
            const { cardsDone, cardsLeft } = getSplitCards(cards, selectedCard)
            if (!selectedCard) selectedCard = cardsLeft.shift()
            await dispatch(updateCardState({ selectedCard, cardsDone, cardsLeft }))
            navigate(`/play`)
            return
        }
        // 1. Create levelGame and populate store
        const response = await supabase
            .from(dbTables.levelGames)
            .insert([
                {
                    deck: deckId,
                    level: levelId,
                    game: gameId,
                    selected_card: null,
                    finished: false,
                },
            ])
            .select()
        if (response.error) {
            console.log(`Error while creating levelGame: ${response.error.message}`)
            showNotification({
                title: "Error",
                message: "Error while creating levelGame",
                color: "red",
            })
            return
        }
        await dispatch(updateLevelGame(response.data[0].id))
        const { cardsDone, cardsLeft } = getSplitCards(cards, null)
        await dispatch(updateCardState({ selectedCard: cardsLeft.shift(), cardsDone, cardsLeft }))
        navigate(`/play`)
    }

    useEffect(() => {
        // Render Decks
        ;(async () => {
            if (gameId && !deckId && !levelId) await renderDecks()
            if (gameId && deckId && !levelId) await renderLevels()
            if (gameId && deckId && levelId) await initialiseGame()
        })()
    }, [gameId, deckId, levelId])

    const dispatchSelected = (id: string, levelNumber: number | null) => {
        // dispatch new deck
        if (!deckId) dispatch(updateDeck(id))
        // dispatch new level
        else if (!levelId) {
            dispatch(updateLevel(id))
            if (levelNumber) dispatch(updateLevelNumber(levelNumber))
        }
    }

    const goBack = () => {
        if (!deckId) navigate("/")
        else if (!levelId) dispatch(updateDeck(null))
        else dispatch(updateLevel(null))
    }

    return (
        <AppContainer>
            <SelectionHeader onClick={goBack}>Start your Game!</SelectionHeader>
            <div className={"mb-4"} />
            <div>
                {displayedItems.map((item) => {
                    return (
                        <SelectionCard
                            name={item.name}
                            description={item.description}
                            onClick={() => dispatchSelected(item.id, parseInt(item.name))}
                            key={item.id}
                        />
                    )
                })}
            </div>
        </AppContainer>
    )
}

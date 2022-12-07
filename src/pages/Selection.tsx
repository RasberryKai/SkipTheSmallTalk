import { useNavigate } from "react-router"
import Header from "../components/common/Header"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectDeck, selectLevel, selectLevelGame, selectLevelNumber, setCardIds, setCardState } from "../store/gameSlice"
import { supabase } from "../lib/Supabase"
import SelectionCard from "../components/selection/SelectionCard"
import { SelectionCardInfo } from "../types"
import { showNotification } from "@mantine/notifications"
import { cardObjectsToStrings, getSplitCards, sortCards } from "../functions/cardCalculations"
import { getCard, getCards } from "../api/cards"
import { dbTables } from "../constants/keys"

export default function Selection() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const game = useSelector((state: any) => state.game.gameId)
    const deck = useSelector((state: any) => state.game.deckId)
    const level = useSelector((state: any) => state.game.levelId)
    const loggedIn = useSelector((state: any) => state.user.loggedIn)
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
        const { data, error } = await supabase.from(dbTables.levels).select("*").eq("deck", deck)
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
        const { data, error } = await supabase
            .from(dbTables.levelGames)
            .select("*")
            .eq("game", game)
            .eq("deck", deck)
            .eq("level", level)
        if (error) {
            console.log(`Error while checking for existing levelGame: ${error}`)
            showNotification({
                title: "Error",
                message: "Error while checking for existing levelGame",
                color: "red",
            })
            return
        }
        let cards = sortCards(await getCards(level))
        if (!cards) {
            showNotification({
                title: "Error",
                message: "Error while getting cards",
                color: "red",
            })
            return
        }
        dispatch(setCardIds(cards.map((card) => card.id)))
        cards = cardObjectsToStrings(cards)
        if (data && data.length > 0) {
            await dispatch(selectLevelGame(data[0].id))
            const selectedCardId = data[0].selected_card
            let selectedCard = await getCard(selectedCardId)
            if (selectedCard) selectedCard = selectedCard.question
            const { cardsDone, cardsLeft } = getSplitCards(cards, selectedCard)
            if (!selectedCard) selectedCard = cardsLeft.shift()
            await dispatch(setCardState({ selectedCard, cardsDone, cardsLeft }))
            navigate(`/play`)
            return
        }
        // 1. Create levelGame and populate store
        const response = await supabase
            .from(dbTables.levelGames)
            .insert([
                {
                    deck: deck,
                    level: level,
                    game: game,
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
        await dispatch(selectLevelGame(response.data[0].id))
        const { cardsDone, cardsLeft } = getSplitCards(cards, null)
        await dispatch(setCardState({ selectedCard: cardsLeft.shift(), cardsDone, cardsLeft }))
        navigate(`/play`)
    }

    useEffect(() => {
        // Render Decks
        ;(async () => {
            if (game && !deck && !level) await renderDecks()
            if (game && deck && !level) await renderLevels()
            if (game && deck && level) await initialiseGame()
        })()
    }, [game, deck, level])

    useEffect(() => {
        if (!loggedIn) navigate("/signIn")
    }, [])

    const dispatchSelected = (id: string, levelNumber: number | null) => {
        // dispatch new deck
        if (!deck) dispatch(selectDeck(id))
        // dispatch new level
        else if (!level) {
            dispatch(selectLevel(id))
            if (levelNumber) dispatch(selectLevelNumber(levelNumber))
        }
    }

    return (
        <>
            <Header>Start your Game!</Header>
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
        </>
    )
}

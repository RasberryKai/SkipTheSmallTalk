import { Link } from "react-router-dom"
import { IconArrowBack, IconChevronLeft, IconChevronRight } from "@tabler/icons"
import ActionBar from "../components/play/ActionBar"
import QuestionCard from "../components/play/QuestionCard"
import { useMantineTheme } from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../types"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { clearGame, nextCard, previousCard, selectDeck, selectGame } from "../store/gameSlice"

export default function Play() {
    // check redux store
    // if no game, navigate to home
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useMantineTheme().colorScheme = "dark"

    const loggedIn = useSelector((state: RootState) => state.user.loggedIn)
    const gameId = useSelector((state: RootState) => state.game.gameId)
    const deckId = useSelector((state: RootState) => state.game.deckId)
    const cardsDone = useSelector((state: RootState) => state.game.cardsDone)
    const cardsLeft = useSelector((state: RootState) => state.game.cardsLeft)

    useEffect(() => {
        if (!loggedIn) navigate("/signIn")
    }, [])

    return (
        <div className={"w-full h-screen flex flex-col items-center"}>
            {/* Backlink */}
            <div className={"w-full flex flex-row justify-start"}>
                <Link
                    to={"/select"}
                    onClick={() => {
                        const id = gameId
                        const deck = deckId
                        dispatch(clearGame())
                        dispatch(selectGame(id))
                        dispatch(selectDeck(deck))
                    }}
                    className={"text-xl text-white flex flex-row items-center"}
                >
                    <IconArrowBack />
                    <p className={"ml-2"}>Back</p>
                </Link>
            </div>
            <div className={"w-full h-full flex flex-col justify-center items-center pb-52"}>
                <QuestionCard />
                <div className={"flex flex-row w-11/12 justify-between items-center"}>
                    <IconChevronLeft
                        onClick={() => {
                            if (cardsDone.length > 0) dispatch(previousCard())
                        }}
                        className={"text-white"}
                    />
                    <ActionBar />
                    <IconChevronRight
                        onClick={() => {
                            if (cardsLeft.length > 0) dispatch(nextCard())
                        }}
                        className={"text-white"}
                    />
                </div>
            </div>
        </div>
    )
}

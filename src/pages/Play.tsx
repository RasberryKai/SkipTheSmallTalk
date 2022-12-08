import { Link } from "react-router-dom"
import { IconArrowBack } from "@tabler/icons"
import NavigationBar from "../components/play/NavigationBar"
import ActionBar from "../components/play/ActionBar"
import QuestionCard from "../components/play/QuestionCard"
import { useMantineTheme } from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../types"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { clearGame, selectDeck, selectGame } from "../store/gameSlice"

export default function Play() {
    // check redux store
    // if no game, navigate to home
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useMantineTheme().colorScheme = "dark"
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn)
    const gameId = useSelector((state: RootState) => state.game.gameId)
    const deckId = useSelector((state: RootState) => state.game.deckId)

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
                <NavigationBar />
                <ActionBar />
            </div>
        </div>
    )
}

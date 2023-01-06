import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { useMantineTheme } from "@mantine/core"
import Card from "../components/home/Card"
import { DisplayGame, RootState } from "../types"
import { useEffect } from "react"
import { supabase } from "../lib/Supabase"
import { logIn, logOut, updateGames, UserState } from "../store/userSlice"
import AddButton from "../components/home/AddButton"
import { clearGame } from "../store/gameSlice"
import { getCurrentEmail, getCurrentUserId, getCurrentUsername, isGoogleUser } from "../api/user"
import { dbTables } from "../constants/keys"
import AppContainer from "../components/common/AppContainer"
import { getGamesFromDBAsDisplayGames } from "../api/games"
import { clearGameSelection, updateGame } from "../store/gameSelectionSlice"
import GameSectionHeader from "../components/home/GameSectionHeader"

export default function Home() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useMantineTheme().colorScheme = "dark"

    const loggedIn: boolean = useSelector((state: RootState) => state.user.loggedIn)
    const user: UserState = useSelector((state: RootState) => state.user)
    const levelGameId = useSelector((state: RootState) => state.game.levelGameId)

    const updateUserInfo = async () => {
        const email = await getCurrentEmail()
        const username = await getCurrentUsername()
        const userId = await getCurrentUserId()
        // input username
        if ((await isGoogleUser()) && !username) {
            navigate("/username")
            return
        }
        // was logged in, but logged out without pressing log out button
        if (loggedIn && (!email || !username || !userId)) {
            dispatch(logOut())
            dispatch(clearGame())
            dispatch(clearGameSelection())
        }
        // logged in
        if (email && username && userId)
            await dispatch(
                logIn({
                    id: userId,
                    email: email,
                    username: username,
                })
            )
    }

    const loadMainPage = () => {
        if (loggedIn) {
            dispatch(clearGame())
            dispatch(clearGameSelection())
        }
        if (loggedIn && user.id) {
            // load games, if user logged in successfully
            getGamesFromDBAsDisplayGames(user.id).then((games) => {
                if (games) dispatch(updateGames(games))
            })
        }
    }

    const handleCardClick = (owner: string, id: string) => {
        if (!owner)
            supabase
                .from(dbTables.games)
                .update({ owner: user.id })
                .eq("id", id)
                .then(() => {})
        if (levelGameId) {
            navigate("/play")
        } else {
            dispatch(updateGame(id))
            navigate("/select")
        }
    }

    useEffect(() => {
        dispatch(clearGameSelection())
        updateUserInfo().then(() => {})
    }, [])

    useEffect(() => {
        loadMainPage()
    }, [user.email])

    return (
        <AppContainer>
            {/* Body Container */}
            <div className={"w-full flex flex-col items-center overflow-scroll mt-4 pl-5 pr-5"}>
                <GameSectionHeader />
                <div className={"w-full pl-2 pr-2 mt-8"}>
                    {user.games &&
                        user.games.map((game: DisplayGame, index: number) => {
                            let src = require("../assets/elementIcons/Soulmates.png")
                            if (game.name === "Test") src = require("../assets/elementIcons/Relationship.jpeg")
                            else if (game.name === "More Tests") src = require("../assets/elementIcons/Relationship.jpeg")
                            return (
                                <Card
                                    name={game.name}
                                    playerNames={game.players}
                                    percentage={game.percentage}
                                    owner={game.owner}
                                    isOwner={game.owner === user.username}
                                    imgSource={src}
                                    onClick={() => handleCardClick(game.owner, game.id)}
                                    id={game.id}
                                    key={index}
                                />
                            )
                        })}
                </div>
                <AddButton />
            </div>
        </AppContainer>
    )
}

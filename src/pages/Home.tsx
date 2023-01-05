import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { Divider, useMantineTheme } from "@mantine/core"
import Card from "../components/home/Card"
import { DisplayGame, RootState } from "../types"
import { useEffect } from "react"
import { supabase } from "../lib/Supabase"
import { logIn, logOut, setGames, UserState } from "../store/userSlice"
import AddButton from "../components/home/AddButton"
import ButtonWrapper from "../components/common/ButtonWrapper"
import UserMenu from "../components/home/UserMenu"
import { clearGame, selectGame } from "../store/gameSlice"
import { getCurrentEmail, getCurrentUserId, getCurrentUsername } from "../api/user"
import { dbTables } from "../constants/keys"
import AppContainer from "../components/common/AppContainer"
import { getGamesFromDB } from "../api/games"

export default function Home() {
    const loggedIn: boolean = useSelector((state: RootState) => state.user.loggedIn)
    const user: UserState = useSelector((state: RootState) => state.user)
    const levelGameId = useSelector((state: RootState) => state.game.levelGameId)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useMantineTheme().colorScheme = "light"

    const updateUserInfo = async () => {
        const email = await getCurrentEmail()
        const username = await getCurrentUsername()
        const userId = await getCurrentUserId()
        if (email && username && userId)
            await dispatch(
                logIn({
                    id: userId,
                    email: email,
                    username: username,
                })
            )
        else {
            await dispatch(logOut())
            await dispatch(clearGame())
        }
    }

    useEffect(() => {
        updateUserInfo().then(() => {})
        // clear game state when users logged in (all saved in DB anyway)
        if (loggedIn) dispatch(clearGame())
    }, [])

    useEffect(() => {
        // Load games from DB, when user's logged in / if userId exists
        // on user.email, because it runs on mount, and whenever the email is loaded (after login)
        ;(async () => {
            if (user.id) {
                const games = await getGamesFromDB(user.id)
                if (games) dispatch(setGames(games))
            }
        })()
    }, [user.email])

    return (
        <AppContainer>
            {/* Header Container */}
            <div className={"mb-2 flex flex-row justify-between items-end"}>
                <p className={"text-4xl text-accent"}>Select a Game!</p>
                {!loggedIn && (
                    <ButtonWrapper onClick={() => navigate("/signIn")} className={"w-1/4"}>
                        Login
                    </ButtonWrapper>
                )}
                {loggedIn && <UserMenu username={user.username} />}
            </div>
            <Divider color={"white"} />
            {/* Body Container */}
            <div className={"flex flex-col items-center overflow-scroll mt-4"}>
                {user.games &&
                    user.games.map((game: DisplayGame, index: number) => (
                        <Card
                            name={game.name}
                            playerNames={game.players}
                            percentage={game.percentage}
                            owner={game.owner}
                            isOwner={game.owner === user.username}
                            onClick={() => {
                                if (!game.owner)
                                    supabase
                                        .from(dbTables.games)
                                        .update({ owner: user.id })
                                        .eq("id", game.id)
                                        .then(() => {})
                                if (levelGameId) {
                                    navigate("/play")
                                } else {
                                    dispatch(selectGame(game.id))
                                    navigate("/select")
                                }
                            }}
                            id={game.id}
                            key={index}
                        />
                    ))}
                <AddButton />
            </div>
        </AppContainer>
    )
}

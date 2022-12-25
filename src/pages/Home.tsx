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
        updateUserInfo().then(() => {
            if (!loggedIn) navigate("/signIn")
        })
    }, [])

    // populate store with games from database
    useEffect(() => {
        ;(async () => {
            if (!user.id) {
                console.log("Game Data No id Found")
                return
            }
            // Fetching Join Table game ids
            const { data, error } = await supabase.from(dbTables.playerGamesJoin).select("game").eq("player", user.id)
            if (error) {
                console.log("Error while fetching PlayerGamesJoin: ", JSON.stringify(error, null, 2))
                return
            }
            const gameIds: string[] = []
            if (!data || data?.length === 0) {
                console.log("No games found for user")
                await dispatch(setGames([]))
                return
            }
            for (const game of data) gameIds.push(game.game)

            // Fetching games, which match the game ids from the join table
            const response = await supabase.from(dbTables.games).select("id, name").in("id", gameIds)
            if (response.error) {
                console.log("Error: ", JSON.stringify(response.error, null, 2))
                return
            }
            if (!response.data) return
            let games: DisplayGame[] = []
            for (const game of response.data) {
                const { data, error } = await supabase.from(dbTables.playerGamesJoin).select("player").eq("game", game.id)
                if (error) {
                    console.log("Error while fetching PlayerGamesJoin: ", JSON.stringify(error, null, 2))
                    continue
                }
                if (!data || data?.length === 0) {
                    console.log("No join data")
                    continue
                }
                const playerNames: string[] = []
                // Fetching player names from profile table
                for (const player of data) {
                    const { data, error } = await supabase.from(dbTables.profiles).select("username").eq("id", player.player)
                    if (error) {
                        console.log("Error while fetching PlayerGamesJoin: ", JSON.stringify(error, null, 2))
                        continue
                    }
                    if (!data || data?.length === 0) {
                        console.log("No join data")
                        continue
                    }
                    playerNames.push(data[0].username)
                }
                games = [...games, { name: game.name, player_names: playerNames, percentage: 69, id: game.id }]
            }
            dispatch(setGames(games))
        })()
    }, [user.email])

    return (
        <>
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
                            playerNames={game.player_names}
                            percentage={game.percentage}
                            onClick={() => {
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
        </>
    )
}

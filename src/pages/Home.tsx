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

    const getGames = async () => {
        const playerGamesJoinResponse = await supabase.from(dbTables.playerGamesJoin).select("*").eq("player", user.id)
        if (playerGamesJoinResponse.error) {
            console.log("Error while fetching participation: " + playerGamesJoinResponse.error.message)
            return
        }
        if (!playerGamesJoinResponse.data) {
            console.log("No participation found")
            return
        }
        const gameIds: string[] = playerGamesJoinResponse.data.map((participation) => participation.game)
        const gamesResponse = await supabase.from(dbTables.games).select("id, name, owner").in("id", gameIds)
        if (gamesResponse.error) {
            console.log("Error while fetching games: " + gamesResponse.error.message)
            return
        }
        if (!gamesResponse.data) {
            console.log("No games found")
            return
        }
        /*
        1. All player ids, where game id is in gameIds --> We only need the names of the players
         */
        const participantsAndOwnersResponse = await supabase
            .from(dbTables.playerGamesJoin)
            .select("player, game")
            .in("game", gameIds)
        if (participantsAndOwnersResponse.error) {
            console.log("Error while fetching participants: " + participantsAndOwnersResponse.error.message)
            return
        }
        if (!participantsAndOwnersResponse.data) {
            console.log("No participants found")
            return
        }
        const participantNamesResponse = await supabase
            .from(dbTables.profiles)
            .select("id, username")
            .in(
                "id",
                participantsAndOwnersResponse.data.map((p) => p.player)
            )
        if (participantNamesResponse.error) {
            console.log("Error while fetching participant names: " + participantNamesResponse.error.message)
            return
        }
        if (!participantNamesResponse.data) {
            console.log("No participant names found")
            return
        }
        const gamesArray: DisplayGame[] = []
        for (const game of gamesResponse.data) {
            const participantIds = participantsAndOwnersResponse.data.filter((p) => p.game === game.id)
            const ownerId = participantIds.find((p) => p.player === game.owner)
            const playerIds = participantIds.filter((p) => p.player !== game.owner)
            const owner = participantNamesResponse.data.find((p) => p.id === ownerId?.player)?.username
            const players = participantNamesResponse.data.filter((p) => playerIds.map((p) => p.player).includes(p.id))
            const displayGame: DisplayGame = {
                id: game.id,
                name: game.name,
                owner: owner,
                players: players.map((p) => p.username),
                percentage: 10,
            }
            gamesArray.push(displayGame)
        }
        return gamesArray
    }

    useEffect(() => {
        ;(async () => {
            const games = await getGames()
            if (games) dispatch(setGames(games))
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
                            playerNames={game.players}
                            percentage={game.percentage}
                            owner={game.owner}
                            isOwner={game.owner === user.username}
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

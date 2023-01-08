import { supabase } from "../lib/Supabase"
import { dbTables } from "../constants/keys"
import { DisplayGame } from "../types"

export async function deleteGame(id: string): Promise<string | null> {
    console.log("ID to delete: ", id)
    const { error } = await supabase.from(dbTables.levelGames).delete().eq("game", id)
    if (error) {
        console.log(error)
        return error.message
    }
    const response = await supabase.from(dbTables.playerGamesJoin).delete().eq("game", id)
    if (response.error) {
        console.log(response.error)
        return response.error.message
    }
    const response2 = await supabase.from(dbTables.games).delete().eq("id", id)
    if (response2.error) {
        console.log(response2.error)
        return response2.error.message
    }
    return null
}

export async function createGame(gameName: string, ownerId: string) {
    const { data, error } = await supabase
        .from(dbTables.games)
        .insert([{ name: gameName, owner: ownerId }])
        .select()
    if (error) {
        console.log(error)
        return null
    }
    return data[0]
}

export async function getGamesFromDBAsDisplayGames(userId: string) {
    const playerGamesJoinResponse = await supabase.from(dbTables.playerGamesJoin).select("*").eq("player", userId)
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
    const participantsAndOwnersResponse = await supabase.from(dbTables.playerGamesJoin).select("player, game").in("game", gameIds)
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

export async function fullTextSearchGames(searchQuery: string) {
    const { data, error } = await supabase.from(dbTables.games).select("id, owner").textSearch("name", `'${searchQuery}'`)
    if (error) {
        console.log(error)
        return null
    }
    return data
}

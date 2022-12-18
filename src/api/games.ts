import { supabase } from "../lib/Supabase"
import { dbTables } from "../constants/keys"

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

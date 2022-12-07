import { supabase } from "../lib/Supabase"

export async function getSelectedCard(levelGameId: string): Promise<string | null> {
    const { data, error } = await supabase.from("levelGame").select("selected_card").eq("id", levelGameId)
    if (error) {
        console.log(`Error getting selected card ${error}`)
        return null
    }
    return data[0].selected_card
}

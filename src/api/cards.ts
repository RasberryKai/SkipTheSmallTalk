import { supabase } from "../lib/Supabase"

export async function getCards(level: string): Promise<any[] | null> {
    const { data, error } = await supabase.from("cards").select("*").eq("level", level)
    if (error) {
        console.log(`Error getting cards for level ${level}: ${error}`)
        return null
    }
    return data
}

export async function getCard(cardId: string | null): Promise<any> {
    if (!cardId) return null
    const { data, error } = await supabase.from("cards").select("*").eq("id", cardId)
    if (error) {
        console.log(`Error getting card ${cardId}: ${error}`)
        return null
    }
    return data[0]
}

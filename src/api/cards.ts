import { supabase } from "../lib/Supabase"

export async function getCards(levelId: string): Promise<any[] | null> {
    const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("level", levelId)
        .order("order_number", { ascending: true })
    if (error) {
        console.log(`Error getting cards for level ${levelId}: ${error}`)
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

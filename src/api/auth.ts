import { supabase } from "../lib/Supabase"

export async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" })
    return error
}

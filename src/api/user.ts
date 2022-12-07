import { supabase } from "../lib/Supabase"

export const getCurrentEmail = async () => {
    const session = await supabase.auth.getSession()
    return session.data.session?.user.email
}

export const getCurrentUsername = async () => {
    const email = await getCurrentEmail()
    const { data, error } = await supabase.from("profiles").select("username").eq("email", email)
    if (error) return null
    if (data && data.length > 0) return data[0].username
    return null
}

export async function emailAlreadyExists(email: string): Promise<boolean> {
    const { data, error } = await supabase.from("profiles").select("*").eq("email", email)
    if (error) return true
    return data.length > 0
}

export async function usernameAlreadyExists(username: string): Promise<boolean> {
    const { data, error } = await supabase.from("profiles").select("*").eq("username", username)
    if (error) return true
    return data.length > 0
}

export async function getCurrentUserId() {
    const email = await getCurrentEmail()
    const { data, error } = await supabase.from("profiles").select("id").eq("email", email)
    if (error) return null
    if (data && data.length > 0) return data[0].id
    return null
}

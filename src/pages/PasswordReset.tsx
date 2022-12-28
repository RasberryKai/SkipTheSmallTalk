import AuthContainer from "../components/authentication/AuthContainer"
import AuthHeader from "../components/authentication/AuthHeader"
import { useEffect, useState } from "react"
import { supabase } from "../lib/Supabase"
import { PasswordInput } from "@mantine/core"

export default function PasswordReset() {
    const [password, setPassword] = useState<string>("")

    const updatePassword = () => {
        supabase.auth.updateUser({ password: password })
    }

    return (
        <AuthContainer onSubmit={() => {}}>
            <AuthHeader>Password Reset</AuthHeader>
            <PasswordInput />
            <PasswordInput />
        </AuthContainer>
    )
}

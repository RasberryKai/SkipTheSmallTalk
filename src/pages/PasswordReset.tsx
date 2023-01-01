import AuthContainer from "../components/authentication/AuthContainer"
import AuthHeader from "../components/authentication/AuthHeader"
import { useState } from "react"
import { Center, PasswordInput, useMantineTheme } from "@mantine/core"
import ButtonWrapper from "../components/common/ButtonWrapper"
import { useForm } from "@mantine/form"
import { supabase } from "../lib/Supabase"
import { useNavigate } from "react-router"
import { showNotification } from "@mantine/notifications"

export default function PasswordReset() {
    useMantineTheme().colorScheme = "dark"
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<string | null>("")
    const form = useForm({
        initialValues: {
            password: "",
            repeatedPassword: "",
        },
        validate: {
            password: (value) => (value.length > 0 ? null : "Password is required"),
            repeatedPassword: (value) => {
                if (value.length === 0) return "Password is required"
                if (value !== form.values.password) return "Passwords do not match"
            },
        },
    })

    const updatePassword = async (values: any) => {
        const { data, error } = await supabase.auth.updateUser({ password: values.password })
        if (error) {
            setErrorMessage(error.message)
            return
        }
        if (data) {
            showNotification({
                title: "Password updated",
                message: "Your password has been updated",
                color: "green",
            })
            navigate("/signIn")
        }
    }

    return (
        <AuthContainer onSubmit={form.onSubmit((values: any) => updatePassword(values))}>
            <AuthHeader>Password Reset</AuthHeader>
            <div className={"w-full h-full flex flex-col"}>
                <PasswordInput
                    className={"w-full mb-4"}
                    label={"Password"}
                    placeholder={"******"}
                    {...form.getInputProps("password")}
                />
                <PasswordInput
                    className={"w-full mb-8"}
                    label={"Repeat Password"}
                    placeholder={"******"}
                    {...form.getInputProps("repeatedPassword")}
                />
                <Center>
                    <ButtonWrapper className={"w-2/3"} variant={"actionable"} type={"submit"}>
                        Update Password
                    </ButtonWrapper>
                </Center>
                {errorMessage && <p className={"text-red-500 text-center mt-8"}>{errorMessage}</p>}
            </div>
        </AuthContainer>
    )
}

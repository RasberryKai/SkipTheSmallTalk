import { useForm } from "@mantine/form"
import { PasswordInput, TextInput } from "@mantine/core"
import ButtonWrapper from "../components/common/ButtonWrapper"
import { supabase } from "../lib/Supabase"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router"
import { emailAlreadyExists, usernameAlreadyExists } from "../api/user"
import { dbTables } from "../constants/keys"

export default function SignUp() {
    const navigate = useNavigate()
    const form = useForm({
        initialValues: {
            email: "",
            username: "",
            password: "",
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            username: (value) => {
                if (value.length < 6) {
                    return "Username must be at least 6 characters"
                }
                return null
            },
        },
    })
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isDisabled, setIsDisabled] = useState<boolean>(false)

    const onSubmit = async () => {
        setIsLoading(true)
        const { email, username, password } = form.values
        // If email already exists try signing in
        if (await emailAlreadyExists(email)) {
            const { error } = await supabase.auth.signInWithPassword({ email: form.values.email, password: form.values.password })
            if (error) {
                setErrorMessage("Email already exists")
                setIsLoading(false)
            } else navigate("/")
            return
        }
        // Prevent duplicate usernames
        if (await usernameAlreadyExists(username)) {
            setErrorMessage("Username already exists")
            setIsLoading(false)
            return
        }
        // username and email are free so SignUp
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username,
                },
            },
        })
        if (error) {
            setErrorMessage(error.message)
            setIsLoading(false)
            return
        }
        await supabase.from(dbTables.profiles).insert([{ username: username, email: email.toLowerCase() }])
        setIsLoading(false)
        setIsDisabled(true)
        showNotification({
            title: "Verification Email sent",
            message: "Please check your email to verify your account",
        })
        form.setValues({ email: "", username: "", password: "" })
    }

    return (
        <div className={"w-full h-screen flex flex-col items-center justify-center pb-32"}>
            <form
                className={"w-11/12 h-2/3 bg-gray rounded-xl flex flex-col items-center pt-6"}
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit()
                }}
            >
                <p className={"text-4xl mb-10"}>Sign Up</p>
                <TextInput
                    label={"Email"}
                    placeholder={"john.doe@gmail.com"}
                    withAsterisk={true}
                    required={true}
                    radius={"md"}
                    variant={"filled"}
                    autoFocus={true}
                    className={"w-11/12 mb-6"}
                    {...form.getInputProps("email")}
                />
                <TextInput
                    label={"Username"}
                    placeholder={"John Doe"}
                    withAsterisk={true}
                    required={true}
                    radius={"md"}
                    variant={"filled"}
                    className={"w-11/12 mb-6"}
                    {...form.getInputProps("username")}
                />
                <PasswordInput
                    label={"Password"}
                    placeholder={"********"}
                    withAsterisk={true}
                    required={true}
                    radius={"md"}
                    variant={"filled"}
                    className={`w-11/12 ${errorMessage ? "mb-2" : "mb-6"}`}
                    {...form.getInputProps("password")}
                />
                {errorMessage && <p className={"text-red-600 mb-4 mr-2 ml-4"}>{errorMessage}</p>}
                <ButtonWrapper
                    disabled={isDisabled}
                    loading={isLoading}
                    variant={"actionable"}
                    type={"submit"}
                    className={"w-1/2"}
                >
                    Sign Up
                </ButtonWrapper>
            </form>
        </div>
    )
}

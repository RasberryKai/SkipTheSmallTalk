import { useForm } from "@mantine/form"
import { PasswordInput, TextInput } from "@mantine/core"
import ButtonWrapper from "../components/common/ButtonWrapper"
import { supabase } from "../lib/Supabase"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router"
import { emailAlreadyExists, usernameAlreadyExists } from "../api/user"
import { dbTables } from "../constants/keys"
import AuthContainer from "../components/authentication/AuthContainer"
import AuthHeader from "../components/authentication/AuthHeader"
import { Link } from "react-router-dom"

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
                if (value.length < 3) return "Username must be at least 3 characters"
                return null
            },
            password: (value) => (value.length > 0 ? null : "Password is required"),
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
        <AuthContainer onSubmit={form.onSubmit(onSubmit)}>
            <AuthHeader>Sign Up</AuthHeader>
            <TextInput
                label={"Email"}
                placeholder={"john.doe@gmail.com"}
                radius={"md"}
                variant={"filled"}
                autoFocus={true}
                className={"w-full mb-6"}
                {...form.getInputProps("email")}
            />
            <TextInput
                label={"Username"}
                placeholder={"John"}
                radius={"md"}
                variant={"filled"}
                className={"w-full mb-6"}
                {...form.getInputProps("username")}
            />
            <PasswordInput
                label={"Password"}
                placeholder={"********"}
                radius={"md"}
                variant={"filled"}
                className={"w-full mb-6"}
                {...form.getInputProps("password")}
            />
            <ButtonWrapper disabled={isDisabled} loading={isLoading} variant={"actionable"} type={"submit"} className={"w-1/2"}>
                Sign Up
            </ButtonWrapper>
            {errorMessage && <p className={"text-red-600 mt-4"}>{errorMessage}</p>}
            <p className={"mt-4"}>
                Already have an account?{" "}
                <Link to={"/signIn"} className={"text-actionable"}>
                    SignIn
                </Link>
            </p>
        </AuthContainer>
    )
}

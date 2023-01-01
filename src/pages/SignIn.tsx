import { useForm } from "@mantine/form"
import { PasswordInput, TextInput, useMantineTheme } from "@mantine/core"
import { Link } from "react-router-dom"
import { supabase } from "../lib/Supabase"
import { useState } from "react"
import { useNavigate } from "react-router"
import ButtonWrapper from "../components/common/ButtonWrapper"
import { emailAlreadyExists, getCurrentUserId, getCurrentUsername } from "../api/user"
import { useDispatch } from "react-redux"
import { logIn } from "../store/userSlice"
import AuthContainer from "../components/authentication/AuthContainer"
import AuthHeader from "../components/authentication/AuthHeader"
import { showNotification } from "@mantine/notifications"
import AppContainer from "../components/common/AppContainer"

export default function SignIn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    useMantineTheme().colorScheme = "dark"
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },

        validate: {
            email: (value) => (isEmail(value) ? null : "Invalid email"),
            password: (value) => (value.length > 0 ? null : "Password is required"),
        },
    })

    const isEmail = (email: string) => {
        return /^\S+@\S+$/.test(email)
    }

    const onSubmit = async () => {
        if (!form.values.email || !form.values.password) return
        if (!isEmail(form.values.email)) return
        setIsLoading(true)
        const { email, password } = form.values
        const { error } = await supabase.auth.signInWithPassword({ email: email, password: password })
        if (error) {
            setErrorMessage(error.message)
            setIsLoading(false)
            return
        }
        const username = await getCurrentUsername()
        const currentUserId = await getCurrentUserId()
        if (email && currentUserId && username) dispatch(logIn({ email: email, username: username, id: currentUserId }))
        navigate("/")
    }

    const handleReset = async () => {
        setErrorMessage("")
        if (!isEmail(form.values.email)) {
            setErrorMessage("Invalid email")
            setIsLoading(false)
            return
        }
        if (!(await emailAlreadyExists(form.values.email))) {
            setErrorMessage("Email does not exist")
            setIsLoading(false)
            return
        }
        setIsLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(form.values.email, {
            redirectTo: "http://localhost:3000/resetPassword",
        })
        if (error) {
            showNotification({
                title: "Error",
                message: error.message,
                color: "realRed",
            })
            setIsLoading(false)
            return
        }
        setIsLoading(false)
        showNotification({
            title: "Success",
            message: "Check your email for a link to reset your password",
            color: "green",
        })
    }

    return (
        <AppContainer>
            <AuthContainer onSubmit={form.onSubmit(onSubmit)}>
                <AuthHeader>Sign In</AuthHeader>
                <TextInput
                    label={"Email"}
                    placeholder={"name@gmail.com"}
                    autoFocus={true}
                    className={"w-full mb-6"}
                    {...form.getInputProps("email")}
                />
                <PasswordInput
                    label={"Password"}
                    placeholder={"Password"}
                    className={"w-full"}
                    {...form.getInputProps("password")}
                />
                <div className={"flex flex-row w-full justify-start mt-2"}>
                    <p className={"mb-4"}>
                        Forgot your password?{" "}
                        <span className={"cursor-pointer text-actionable"} onClick={handleReset}>
                            Reset
                        </span>
                    </p>
                </div>
                <ButtonWrapper loading={isLoading} onClick={onSubmit} type={"submit"} variant={"actionable"} className={"w-1/2"}>
                    Login
                </ButtonWrapper>
                {errorMessage && <p className={"text-base text-red-500 mt-2"}>{errorMessage}</p>}
                <p className={errorMessage ? "mt-12" : "mt-20"}>
                    Don't have an account?{" "}
                    <Link to={"/signUp"} className={"text-actionable"}>
                        Signup
                    </Link>
                </p>
            </AuthContainer>
        </AppContainer>
    )
}

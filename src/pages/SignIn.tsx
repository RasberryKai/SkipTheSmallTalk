import { useForm } from "@mantine/form"
import { PasswordInput, TextInput, useMantineTheme } from "@mantine/core"
import { Link } from "react-router-dom"
import { supabase } from "../lib/Supabase"
import { useState } from "react"
import { useNavigate } from "react-router"
import ButtonWrapper from "../components/common/ButtonWrapper"
import { getCurrentUserId, getCurrentUsername } from "../api/user"
import { useDispatch } from "react-redux"
import { logIn } from "../store/userSlice"
import AuthContainer from "../components/authentication/AuthContainer"
import AuthHeader from "../components/authentication/AuthHeader"

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

    const handleReset = async () => {}

    return (
        <AuthContainer onSubmit={form.onSubmit(onSubmit)}>
            <AuthHeader>Sign In</AuthHeader>
            <TextInput
                label={"Email"}
                placeholder={"name@gmail.com"}
                radius={"md"}
                variant={"filled"}
                autoFocus={true}
                className={"w-full mb-6"}
                {...form.getInputProps("email")}
            />
            <PasswordInput
                label={"Password"}
                placeholder={"Password"}
                radius={"md"}
                variant={"filled"}
                className={"w-full"}
                {...form.getInputProps("password")}
            />
            <div className={"flex flex-row w-full justify-start mt-2"}>
                <p className={"text-sm mb-4"}>
                    Forgot your password?{" "}
                    <span className={"cursor-pointer text-link"} onClick={handleReset}>
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
    )
}

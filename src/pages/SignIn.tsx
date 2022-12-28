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

export default function SignIn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useMantineTheme().colorScheme = "dark"
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            password: (value) => (value.length > 0 ? null : "Password is required"),
        },
    })

    const onSubmit = async () => {
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
        <div className={"w-full h-screen flex flex-col items-center justify-center pb-32"}>
            <form
                className={"w-11/12 h-2/3 bg-gray rounded-xl flex flex-col items-center pt-6 pl-4 pr-4"}
                onSubmit={form.onSubmit(onSubmit)}
            >
                <p className={"text-4xl mb-10"}>Sign In</p>
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
                <p className={"mt-20"}>
                    Don't have an account?{" "}
                    <Link to={"/signUp"} className={"text-actionable"}>
                        Signup
                    </Link>
                </p>
            </form>
        </div>
    )
}

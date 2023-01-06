import AppContainer from "../components/common/AppContainer"
import AuthContainer from "../components/authentication/AuthContainer"
import AuthHeader from "../components/authentication/AuthHeader"
import { TextInput } from "@mantine/core"
import ButtonWrapper from "../components/common/ButtonWrapper"
import { useState } from "react"
import { addUser, getCurrentEmail, getCurrentUsername, usernameAlreadyExists } from "../api/user"
import { useNavigate } from "react-router"

export default function Username() {
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const validateUsername = async () => {
        setLoading(true)
        const takenUsername = await getCurrentUsername()
        if (takenUsername) navigate("/")
        if (!username) {
            setErrorMessage("Username cannot be empty")
            setLoading(false)
            return
        }
        if (username.length < 3) {
            setErrorMessage("Username must be at least 3 characters")
            setLoading(false)
            return
        }
        if (username.length > 20) {
            setErrorMessage("Username must be at most 20 characters")
            setLoading(false)
            return
        }
        const isTaken = await usernameAlreadyExists(username)
        if (isTaken) {
            setErrorMessage("Username already taken")
            setLoading(false)
            return
        }
        const email = await getCurrentEmail()
        if (!email) {
            setErrorMessage("Email not found")
            setLoading(false)
            return
        }
        const success = await addUser(email, username)
        if (success) navigate("/")
        else {
            setErrorMessage("Failed to add user")
            setLoading(false)
        }
    }

    return (
        <AppContainer>
            <AuthContainer
                onSubmit={(e: any) => {
                    e.preventDefault()
                    validateUsername().then()
                }}
            >
                <AuthHeader>Username</AuthHeader>
                <div className={"mt-2"}>
                    <p className={"text-center text-gray-500"}>Your username is your unique identifier on this site.</p>
                </div>
                <TextInput
                    className={"mt-8 w-11/12"}
                    placeholder={"Username"}
                    label="Username"
                    description="You can't change it, so choose it carefully"
                    value={username}
                    onChange={(e) => setUsername(e.currentTarget.value)}
                />
                {errorMessage && (
                    <div className={"mt-2"}>
                        <p className={"text-center text-red-500"}>{errorMessage}</p>
                    </div>
                )}
                <ButtonWrapper
                    className={"mt-12 w-1/2"}
                    variant={"actionable"}
                    onClick={validateUsername}
                    loading={loading}
                    type={"submit"}
                >
                    Submit
                </ButtonWrapper>
            </AuthContainer>
        </AppContainer>
    )
}

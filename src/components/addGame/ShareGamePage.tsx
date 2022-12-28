import { TextInput } from "@mantine/core"
import ButtonWrapper from "../common/ButtonWrapper"
import React, { useState } from "react"
import { supabase } from "../../lib/Supabase"
import { dbTables } from "../../constants/keys"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../types"
import RemovableUserItem from "./RemovableUserItem"
import { selectGameCreationId, selectGameCreationName } from "../../store/gameCreationSlice"

export default function ShareGamePage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userId = useSelector((state: RootState) => state.user.id)
    const userEmail = useSelector((state: RootState) => state.user.email)
    const userName = useSelector((state: RootState) => state.user.username)
    const gameId = useSelector((state: RootState) => state.gameCreation.gameId)

    const [users, setUsers] = useState<{ id: string; username: string }[]>([])
    const [currentUserError, setCurrentUserError] = useState<string>("")
    const [currentUserInput, setCurrentUserInput] = useState<string>("")

    const handleRemove = (index: number) => {
        const values = [...users]
        values.splice(index, 1)
        setUsers(values)
    }

    const addUser = async () => {
        const { id, errorMessage, username } = await validateAndGetUser()
        if (errorMessage) {
            setCurrentUserError(errorMessage)
            setCurrentUserInput("")
            return
        }
        const values = [...users]
        values.push({ id: id, username: username })
        setUsers(values)
        setCurrentUserError("")
        setCurrentUserInput("")
    }

    const isEmail = (email: string) => {
        let regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        return regex.test(email)
    }

    const validateAndGetUser = async () => {
        if (currentUserInput.trim().length === 0) return { id: "", errorMessage: "Username cannot be empty", username: "" }
        for (let i = 0; i < users.length; i++)
            if (users[i].username === currentUserInput) return { id: "", errorMessage: "User already added", username: "" }

        if (isEmail(currentUserInput)) {
            // check if email exists, and return id, and username
            if (currentUserInput === userEmail)
                return { id: "", errorMessage: "You can't share the game with yourself", username: "" }
            const { data, error } = await supabase.from(dbTables.profiles).select("id, username").eq("email", currentUserInput)
            if (error) return { id: "", errorMessage: error.message, username: "" }
            if (data.length === 0) return { id: "", errorMessage: "User does not exist", username: "" }
            for (let i = 0; i < users.length; i++)
                if (users[i].id === data[0].id) return { id: "", errorMessage: "User already added", username: "" }
            return { id: data[0].id, errorMessage: "", username: data[0].username }
        }

        // check if username exists, and return id, and username
        if (currentUserInput === userName) return { id: "", errorMessage: "You can't share the game with yourself", username: "" }
        const { data, error } = await supabase.from(dbTables.profiles).select("id").eq("username", currentUserInput)
        if (error) return { id: "", errorMessage: error.message, username: "" }
        if (data.length === 0) return { id: "", errorMessage: "User does not exist", username: "" }
        return { id: data[0].id, errorMessage: "", username: currentUserInput }
    }

    const handleCreate = async () => {
        // register creating user as player to game in db
        const { error } = await supabase.from(dbTables.playerGamesJoin).insert({ player: userId, game: gameId })
        if (error) {
            console.log("Response Error: ", JSON.stringify(error, null, 2))
            showNotification({
                title: "Failed to Create Game",
                message: error.message,
            })
            return
        }
        // register users to game in db
        for (const userObject of users) {
            const { error } = await supabase.from(dbTables.playerGamesJoin).insert({ player: userObject.id, game: gameId })
            if (error)
                showNotification({
                    title: `Failed to add ${userObject.username} to game`,
                    message: "",
                    color: "red",
                })
            console.log(error?.message)
        }
        // go home
        navigate("/")
        dispatch(selectGameCreationName(""))
        dispatch(selectGameCreationId(""))
    }

    return (
        <>
            <div className={"w-full pt-14 h-full"}>
                <form onSubmit={(e: any) => e.preventDefault()}>
                    <TextInput
                        placeholder={"Enter username or email"}
                        label={"Username / Email"}
                        autoFocus
                        size={"md"}
                        radius={"lg"}
                        className={"w-full mb-2"}
                        value={currentUserInput}
                        error={currentUserError}
                        onChange={(event: any) => setCurrentUserInput(event.currentTarget.value)}
                    />
                    <div className={"w-full flex flex-col justify-center pt-5 mb-4"}>
                        <div className={"flex flex-row justify-end"}>
                            <ButtonWrapper className={"h-12"} variant={"actionable"} type={"submit"} onClick={addUser}>
                                Add User
                            </ButtonWrapper>
                        </div>
                    </div>
                </form>
                <div className={"overflow-scroll h-3/5"}>
                    {users.map((user, index) => (
                        <RemovableUserItem key={index} number={index + 1} onRemove={handleRemove}>
                            {user.username}
                        </RemovableUserItem>
                    ))}
                </div>
            </div>
            <ButtonWrapper onClick={handleCreate} className={"w-2/5 h-12 absolute top-[82%]"}>
                Finish
            </ButtonWrapper>
        </>
    )
}

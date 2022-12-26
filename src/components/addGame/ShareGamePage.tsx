import { TextInput } from "@mantine/core"
import ButtonWrapper from "../common/ButtonWrapper"
import React, { useState } from "react"
import { supabase } from "../../lib/Supabase"
import { dbTables } from "../../constants/keys"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { RootState } from "../../types"
import RemovableUserItem from "./RemovableUserItem"

export default function ShareGamePage() {
    const navigate = useNavigate()
    const userId = useSelector((state: RootState) => state.user.id)

    const [users, setUsers] = useState<{ id: string; username: string }[]>([])
    const [currentUserError, setCurrentUserError] = useState<string>("")
    const [currentUser, setCurrentUser] = useState<string>("")

    const handleRemove = (index: number) => {
        const values = [...users]
        values.splice(index, 1)
        setUsers(values)
    }

    const addUser = async () => {
        setCurrentUserError("")
        const errorMessage = await validateUser()
        if (errorMessage) {
            setCurrentUserError(errorMessage)
            return
        }
        const values = [...users]
        values.push({ id: currentUser, username: currentUser })
        setUsers(values)
        setCurrentUser("")
    }

    const validateUser = async () => {
        if (currentUser.trim().length === 0) {
            return "Username cannot be empty"
        }
        return null
    }

    const handleCreate = async () => {
        // register creating user as player to game in db
        // TODO: Get game Id from redux
        const gameId = ""
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
        // TODO: Error handling
        for (const userObject of users) {
            const { error } = await supabase.from(dbTables.playerGamesJoin).insert({ player: userObject.id, game: gameId })
            console.log(error?.message)
        }
        // go home
        navigate("/")
    }

    return (
        <>
            <div className={"w-full mt-14 h-full"}>
                <TextInput
                    placeholder={"Username / Email"}
                    autoFocus={true}
                    size={"md"}
                    radius={"lg"}
                    className={"w-full mb-2"}
                    value={currentUser}
                    error={currentUserError}
                    onChange={(event: any) => setCurrentUser(event.currentTarget.value)}
                />
                <div className={"w-full flex flex-col justify-center pt-5 mb-4"}>
                    <div className={"flex flex-row justify-end"}>
                        {/* TODO: On click validate user, and add */}
                        <ButtonWrapper className={"h-12"} variant={"actionable"} type={"submit"} onClick={addUser}>
                            Add User
                        </ButtonWrapper>
                    </div>
                </div>
                <div className={"overflow-scroll h-4/5"}>
                    {users.map((user, index) => (
                        <RemovableUserItem key={index} number={index + 1} onRemove={handleRemove}>
                            {user.username}
                        </RemovableUserItem>
                    ))}
                </div>
            </div>
            <ButtonWrapper onClick={handleCreate} className={"w-2/5 h-12 absolute top-[92%]"}>
                Finish
            </ButtonWrapper>
        </>
    )
}

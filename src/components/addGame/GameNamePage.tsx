import { TextInput } from "@mantine/core"
import React, { useState } from "react"
import { showNotification } from "@mantine/notifications"
import ButtonWrapper from "../common/ButtonWrapper"
import { useDispatch, useSelector } from "react-redux"
import { updateGameCreationId, updateGameCreationName } from "../../store/gameCreationSlice"
import { RootState } from "../../types"
import { createGame } from "../../api/games"
import { addGame } from "../../store/userSlice"
import { useNavigate } from "react-router"

export default function GameNamePage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userId = useSelector((state: RootState) => state.user.id)
    const existingGameName = useSelector((state: RootState) => state.gameCreation.gameName)
    const [gameName, setGameName] = useState<string>(existingGameName ? existingGameName : "")
    const [gameNameError, setGameNameError] = useState<string>("")

    const validate = () => {
        if (gameName.trim().length === 0) {
            setGameNameError("Game name cannot be empty")
            return false
        }
        return true
    }

    const handleCreate = async () => {
        const canProceed = validate()
        if (!canProceed) return
        if (!userId) {
            dispatch(
                addGame({
                    id: "temp",
                    name: gameName,
                    owner: "You",
                    players: [],
                    percentage: 10,
                })
            )
            setGameName("")
            setGameNameError("")
            navigate("/")
            return
        }
        const created: any = await createGame(gameName, userId)
        if (!created) {
            showNotification({
                title: "Failed to Create Game",
                message: "Try again in a few minutes",
                color: "red",
            })
            return
        }
        if (!created.id || !created.name) {
            showNotification({
                title: "Failed to Create Game",
                message: "Game was not created",
                color: "red",
            })
            return
        }
        dispatch(updateGameCreationId(created.id))
        dispatch(updateGameCreationName(created.name))
    }
    return (
        <div className={"w-full pt-14"}>
            <form onSubmit={(e: any) => e.preventDefault()}>
                <TextInput
                    className={"w-full text-actionable"}
                    size={"md"}
                    radius={"lg"}
                    label={"Game Name"}
                    placeholder={"Family"}
                    autoFocus
                    error={gameNameError}
                    value={gameName}
                    onChange={(event: any) => setGameName(event.currentTarget.value)}
                />
                <div className={"flex flex-row w-full justify-end"}>
                    <ButtonWrapper onClick={handleCreate} className={"w-2/5 h-12 mt-8"} type={"submit"}>
                        Next
                    </ButtonWrapper>
                </div>
            </form>
        </div>
    )
}

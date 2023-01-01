import { TextInput } from "@mantine/core"
import React, { useState } from "react"
import { supabase } from "../../lib/Supabase"
import { dbTables } from "../../constants/keys"
import { showNotification } from "@mantine/notifications"
import ButtonWrapper from "../common/ButtonWrapper"
import { useDispatch, useSelector } from "react-redux"
import { selectGameCreationId, selectGameCreationName } from "../../store/gameCreationSlice"
import { RootState } from "../../types"

export default function GameNamePage() {
    const dispatch = useDispatch()

    const userId = useSelector((state: RootState) => state.user.id)
    const [gameName, setGameName] = useState<string>("")
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
        const { data, error } = await supabase
            .from(dbTables.games)
            .insert({
                name: gameName,
                owner: userId,
            })
            .select()
        if (error) {
            console.log("Inserting Game Error: " + error.message)
            showNotification({
                title: "Failed to Create Game",
                message: error.message,
                color: "red",
            })
            return
        }
        const created = data[0]
        if (!created.id || !created.name) {
            showNotification({
                title: "Failed to Create Game",
                message: "Game was not created",
                color: "red",
            })
            return
        }
        dispatch(selectGameCreationId(created.id))
        dispatch(selectGameCreationName(created.name))
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
                    <ButtonWrapper onClick={handleCreate} className={"w-2/5 h-12 absolute top-[82%]"} type={"submit"}>
                        Next
                    </ButtonWrapper>
                </div>
            </form>
        </div>
    )
}

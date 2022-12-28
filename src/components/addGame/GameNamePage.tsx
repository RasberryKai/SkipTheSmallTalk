import { TextInput } from "@mantine/core"
import React, { useState } from "react"
import { supabase } from "../../lib/Supabase"
import { dbTables } from "../../constants/keys"
import { showNotification } from "@mantine/notifications"
import ButtonWrapper from "../common/ButtonWrapper"
import { useDispatch } from "react-redux"
import { selectGameCreationId, selectGameCreationName } from "../../store/gameCreationSlice"

export default function GameNamePage() {
    const dispatch = useDispatch()

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
        <div className={"w-full mt-14"}>
            <TextInput
                className={"w-full mt-4 text-actionable"}
                size={"md"}
                radius={"lg"}
                label={"Game Name"}
                placeholder={"Family"}
                error={gameNameError}
                value={gameName}
                onChange={(event: any) => setGameName(event.currentTarget.value)}
            />
            <div className={"flex flex-row w-full justify-end"}>
                <ButtonWrapper onClick={handleCreate} className={"w-2/5 h-12 absolute top-[75%]"}>
                    Next
                </ButtonWrapper>
            </div>
        </div>
    )
}

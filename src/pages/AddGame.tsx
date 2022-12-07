import React, { useEffect, useRef, useState } from "react"
import Header from "../components/common/Header"
import InputPair from "../components/addGame/InputPair"
import InputSelectionMenu from "../components/addGame/InputSelectionMenu"
import { useMantineTheme, TextInput } from "@mantine/core"
import { DynamicInput } from "../types"
import ButtonWrapper from "../components/common/ButtonWrapper"
import { supabase } from "../lib/Supabase"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { dbTables } from "../constants/keys"

export default function AddGame() {
    useMantineTheme().colorScheme = "light"
    const navigate = useNavigate()
    const userId = useSelector((state: any) => state.user.id)
    const loggedIn = useSelector((state: any) => state.user.loggedIn)
    const [inputs, setInputs] = useState<DynamicInput[]>([{ type: "name", value: "" }])
    const nameRef = useRef<HTMLInputElement>(null)
    const [nameErr, setNameErr] = useState<string | null>(null)

    const handleChange = (index: number, event: any) => {
        const values = [...inputs]
        values[index].value = event.target.value
        setInputs(values)
    }

    const handleRemove = (index: number) => {
        const values = [...inputs]
        values.splice(index, 1)
        setInputs(values)
    }

    const handleCreate = async () => {
        if (!nameRef?.current?.value) {
            setNameErr("Please fill in name")
            return
        }
        const playerIds: string[] = []
        const player_names: string[] = []
        // filter inputs
        for (const input of inputs) {
            if (input.type === "user") {
                const { data, error } = await supabase
                    .from(dbTables.profiles)
                    .select("id")
                    .or(`username.eq.${input.value},email.eq.${input.value}`)
                if (error) {
                    console.log(error)
                    continue
                }
                if (data.length > 0 && data[0].id && !playerIds.includes(data[0].id)) playerIds.push(data[0].id)
            } else {
                if (input.value && !player_names.includes(input.value)) player_names.push(input.value)
            }
        }
        const { data, error } = await supabase
            .from(dbTables.games)
            .insert({
                player_names: player_names,
                name: nameRef.current.value,
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
        const gameId = data[0].id
        const response = await supabase.from(dbTables.playerGamesJoin).insert({ player: userId, game: gameId })
        if (response.error) {
            console.log("Response Error: ", JSON.stringify(response.error, null, 2))
            return
        }
        for (const playerId of playerIds) {
            const { error } = await supabase.from(dbTables.playerGamesJoin).insert({ player: playerId, game: gameId })
            console.log(error?.message)
        }
        showNotification({
            title: "Game created",
            message: `Game ${nameRef.current.value} created`,
            color: "green",
        })
        navigate("/")
    }

    useEffect(() => {
        if (!loggedIn) navigate("/signIn")
    }, [])

    return (
        <>
            <Header>Who plays?</Header>
            {/* Spacing Container */}
            <div className={"flex flex-col h-4/5 justify-between items-end"}>
                <TextInput
                    error={nameErr}
                    ref={nameRef}
                    placeholder={"Game Name"}
                    className={"w-full mt-4"}
                    size={"md"}
                    radius={"md"}
                />
                <div className={"w-full flex flex-col justify-center pt-5"}>
                    {inputs.map((input, index) => (
                        <InputPair
                            key={index}
                            inputNumber={index + 1}
                            placeholder={input.type === "name" ? "Player Name" : "Email / Username"}
                            value={input.value}
                            onChange={(event) => handleChange(index, event)}
                            onRemove={() => handleRemove(index)}
                        />
                    ))}
                    <div className={"flex flex-row justify-end"}>
                        <InputSelectionMenu inputs={inputs} setInputs={setInputs} />
                    </div>
                </div>
                <ButtonWrapper variant={"actionable"} onClick={handleCreate} className={"w-2/5 h-12 absolute top-[75%]"}>
                    Create Game
                </ButtonWrapper>
            </div>
        </>
    )
}

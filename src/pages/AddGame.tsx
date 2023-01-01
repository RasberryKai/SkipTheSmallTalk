import React from "react"
import Header from "../components/common/Header"
import { useMantineTheme } from "@mantine/core"
import { RootState } from "../types"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import useNeedsToBeLoggedIn from "../hooks/useNeedsToBeLoggedIn"
import AddPlayersGamePage from "../components/addGame/AddPlayersGamePage"
import GameNamePage from "../components/addGame/GameNamePage"
import { selectGameCreationId, selectGameCreationName } from "../store/gameCreationSlice"
import { supabase } from "../lib/Supabase"

export default function AddGame() {
    useNeedsToBeLoggedIn()
    const theme = useMantineTheme()
    theme.colorScheme = "light"

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const gameId = useSelector((state: RootState) => state.gameCreation.gameId)
    const handleBack = () => {
        if (gameId) {
            dispatch(selectGameCreationId(""))
            supabase.from("games").delete().eq("id", gameId).then()
        } else {
            dispatch(selectGameCreationName(""))
            navigate(-1)
        }
    }

    return (
        <>
            <Header onClick={handleBack}>{gameId ? "Add Players!" : "Create your Game!"}</Header>
            <div className={"flex flex-col w-full h-4/5 justify-between items-end"}>
                {gameId ? <AddPlayersGamePage /> : <GameNamePage />}
            </div>
        </>
    )
}

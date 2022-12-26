import React from "react"
import Header from "../components/common/Header"
import { useMantineTheme } from "@mantine/core"
import { RootState } from "../types"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import useNeedsToBeLoggedIn from "../hooks/useNeedsToBeLoggedIn"
import ShareGamePage from "../components/addGame/ShareGamePage"
import GameNamePage from "../components/addGame/GameNamePage"
import { selectGameCreationId, selectGameCreationName } from "../store/gameCreationSlice"

export default function AddGame() {
    useNeedsToBeLoggedIn()
    useMantineTheme().colorScheme = "light"

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const gameName = useSelector((state: RootState) => state.gameCreation.gameName)
    const handleBack = () => {
        if (gameName) {
            dispatch(selectGameCreationId(""))
            dispatch(selectGameCreationName(""))
        } else {
            navigate(-1)
        }
    }

    return (
        <>
            <Header onClick={handleBack}>{gameName ? "Share Game!" : "Create your Game!"}</Header>
            <div className={"flex flex-col w-full h-4/5 justify-between items-end"}>
                {gameName ? <ShareGamePage /> : <GameNamePage />}
            </div>
        </>
    )
}

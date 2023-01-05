import Header from "../components/common/Header"
import { useMantineTheme } from "@mantine/core"
import { RootState } from "../types"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import AddPlayersGamePage from "../components/addGame/AddPlayersGamePage"
import GameNamePage from "../components/addGame/GameNamePage"
import { updateGameCreationId, updateGameCreationName } from "../store/gameCreationSlice"
import { supabase } from "../lib/Supabase"
import AppContainer from "../components/common/AppContainer"

export default function AddGame() {
    const theme = useMantineTheme()
    theme.colorScheme = "light"

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const gameId = useSelector((state: RootState) => state.gameCreation.gameId)
    const handleBack = () => {
        if (gameId) {
            dispatch(updateGameCreationId(""))
            supabase.from("games").delete().eq("id", gameId).then()
        } else {
            dispatch(updateGameCreationName(""))
            navigate(-1)
        }
    }

    return (
        <AppContainer>
            <Header onClick={handleBack}>{gameId ? "Add Players!" : "Create your Game!"}</Header>
            <div className={"flex flex-col w-full h-4/5 justify-between items-end"}>
                {gameId ? <AddPlayersGamePage /> : <GameNamePage />}
            </div>
        </AppContainer>
    )
}

import { nextCard, previousCard } from "../../store/gameSlice"
import ActionBar from "./ActionBar"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../types"
import { supabase } from "../../lib/Supabase"
import { dbTables } from "../../constants/keys"
import ChevronButton from "./ChevronButton"

export default function ControlBar() {
    const dispatch = useDispatch()

    const cardsDone = useSelector((state: RootState) => state.game.cardsDone)
    const cardsLeft = useSelector((state: RootState) => state.game.cardsLeft)
    const levelGameId = useSelector((state: RootState) => state.game.levelGameId)
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn)

    return (
        <div className={"flex flex-row w-full justify-between items-center w-[90%]"}>
            <ChevronButton
                direction={"left"}
                onClick={() => {
                    if (cardsDone.length > 0) dispatch(previousCard())
                }}
            />
            <ActionBar />
            <ChevronButton
                direction={"right"}
                onClick={() => {
                    if (cardsLeft.length === 1 && loggedIn)
                        supabase
                            .from(dbTables.levelGames)
                            .update({ finished: true })
                            .eq("id", levelGameId)
                            .then(() => {})
                    if (cardsLeft.length > 0) dispatch(nextCard())
                }}
            />
        </div>
    )
}

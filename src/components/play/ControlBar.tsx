import { IconChevronLeft, IconChevronRight } from "@tabler/icons"
import { nextCard, previousCard } from "../../store/gameSlice"
import ActionBar from "./ActionBar"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../types"
import RoundIconButton from "./RoundIconButton"
import { supabase } from "../../lib/Supabase"
import { dbTables } from "../../constants/keys"

export default function ControlBar() {
    const dispatch = useDispatch()
    const cardsDone = useSelector((state: RootState) => state.game.cardsDone)
    const cardsLeft = useSelector((state: RootState) => state.game.cardsLeft)
    const levelGameId = useSelector((state: RootState) => state.game.levelGameId)

    return (
        <div className={"flex flex-row w-full justify-between items-center w-[90%]"}>
            <RoundIconButton
                onClick={() => {
                    if (cardsDone.length > 0) dispatch(previousCard())
                }}
            >
                <IconChevronLeft size={45} color={"#464545"} className={"mr-2"} />
            </RoundIconButton>
            <ActionBar />
            <RoundIconButton
                onClick={() => {
                    if (cardsLeft.length === 1)
                        supabase
                            .from(dbTables.levelGames)
                            .update({ finished: true })
                            .eq("id", levelGameId)
                            .then(() => {})
                    if (cardsLeft.length > 0) dispatch(nextCard())
                }}
            >
                <IconChevronRight size={45} color={"#464545"} className={"ml-2"} />
            </RoundIconButton>
        </div>
    )
}

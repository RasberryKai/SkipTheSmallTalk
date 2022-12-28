import { IconChevronLeft, IconChevronRight } from "@tabler/icons"
import { nextCard, previousCard } from "../../store/gameSlice"
import ActionBar from "./ActionBar"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../types"
import RoundIconButton from "./RoundIconButton"

export default function ControlBar() {
    const dispatch = useDispatch()
    const cardsDone = useSelector((state: RootState) => state.game.cardsDone)
    const cardsLeft = useSelector((state: RootState) => state.game.cardsLeft)

    return (
        <div className={"flex flex-row w-full justify-between items-center"}>
            <RoundIconButton
                onClick={() => {
                    if (cardsDone.length > 0) dispatch(previousCard())
                }}
            >
                <IconChevronLeft size={60} color={"#464545"} className={"mr-2"} />
            </RoundIconButton>
            <ActionBar />
            <RoundIconButton
                onClick={() => {
                    if (cardsLeft.length > 0) dispatch(nextCard())
                }}
            >
                <IconChevronRight size={60} color={"#464545"} className={"ml-2"} />
            </RoundIconButton>
        </div>
    )
}

import { useDispatch, useSelector } from "react-redux"
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons"
import { jumpToCard, nextCard, previousCard } from "../../store/gameSlice"

export default function NavigationBar() {
    const dispatch = useDispatch()
    const levelNumber = useSelector((state: any) => state.game.level)
    const cardsDone = useSelector((state: any) => state.game.cardsDone)
    const cardsLeft = useSelector((state: any) => state.game.cardsLeft)

    return (
        <div className={"w-full flex flex-row justify-around mt-8 text-white font-bold"}>
            <div className={"flex flex-row"}>
                <IconChevronsLeft onClick={() => dispatch(jumpToCard(0))} />
                <IconChevronLeft
                    onClick={() => {
                        if (cardsDone.length > 0) dispatch(previousCard())
                    }}
                />
            </div>
            <p>
                LEVEL {levelNumber} - {1 + cardsDone.length} / {1 + cardsDone.length + cardsLeft.length}
            </p>
            <div className={"flex flex-row"}>
                <IconChevronRight
                    onClick={() => {
                        if (cardsLeft.length > 0) dispatch(nextCard())
                    }}
                />
                <IconChevronsRight onClick={() => dispatch(jumpToCard(cardsDone.length + cardsLeft.length))} />
            </div>
        </div>
    )
}

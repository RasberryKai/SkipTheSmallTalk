import { useSwipeable } from "react-swipeable"
import { nextCard, previousCard } from "../../store/gameSlice"
import { swipeableConfig } from "../../constants/config"
import { useDispatch, useSelector } from "react-redux"
import { Popover } from "@mantine/core"
import { useState } from "react"

export default function QuestionCard() {
    const dispatch = useDispatch()
    const [opened, setOpened] = useState<boolean>(false)
    const currentCard = useSelector((state: any) => state.game.currentCard)
    const cardsDone = useSelector((state: any) => state.game.cardsDone)
    const cardsLeft = useSelector((state: any) => state.game.cardsLeft)
    const swipeableHandlers = useSwipeable({
        onSwipedLeft: () => {
            if (cardsLeft.length > 0) dispatch(nextCard())
        },
        onSwipedRight: () => {
            if (cardsDone.length > 0) dispatch(previousCard())
        },
        onTap: () => {
            navigator.clipboard.writeText(currentCard)
            setOpened(true)
            setTimeout(() => {
                setOpened(false)
            }, 1000)
        },
        ...swipeableConfig,
    })

    return (
        <Popover width={90} position={"top"} withArrow opened={opened}>
            <Popover.Target>
                <div
                    className={
                        "w-11/12 h-56 bg-white rounded-[70px] flex flex-row justify-center items-center p-8 shadow-md shadow-black select-none"
                    }
                    {...swipeableHandlers}
                >
                    <p className={"text-black text-lg text-center"}>{currentCard}</p>
                </div>
            </Popover.Target>
            <Popover.Dropdown>
                <p className={"text-center"}>Copied!</p>
            </Popover.Dropdown>
        </Popover>
    )
}

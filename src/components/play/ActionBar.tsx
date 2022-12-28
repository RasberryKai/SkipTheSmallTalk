import { IconClipboard, IconHome } from "@tabler/icons"
import { useDispatch, useSelector } from "react-redux"
import { Popover, Tooltip } from "@mantine/core"
import { useState } from "react"
import { clearGame } from "../../store/gameSlice"
import { useNavigate } from "react-router"
import { RootState } from "../../types"

export default function ActionBar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentCard = useSelector((state: RootState) => state.game.currentCard)
    const levelNumber = useSelector((state: RootState) => state.game.level)
    const cardsDone = useSelector((state: RootState) => state.game.cardsDone)
    const cardsLeft = useSelector((state: RootState) => state.game.cardsLeft)

    const [opened, setOpened] = useState<boolean>(false)
    const size = 25

    return (
        <div className={"flex flex-col text-white mt-4"}>
            <p className={"font-bold"}>
                LEVEL {levelNumber} - {1 + cardsDone.length} / {1 + cardsDone.length + cardsLeft.length}
            </p>
            <div className={"flex flex-row justify-center"}>
                <Tooltip label={"Home"}>
                    <div>
                        <IconHome
                            size={size}
                            onClick={() => {
                                dispatch(clearGame())
                                navigate("/")
                            }}
                        />
                    </div>
                </Tooltip>
                <Popover opened={opened} withArrow>
                    <Popover.Target>
                        <Tooltip label={"Copy"}>
                            <div className={"ml-6"}>
                                <IconClipboard
                                    size={size}
                                    onClick={() => {
                                        if (!currentCard) return
                                        navigator.clipboard.writeText(currentCard)
                                        setOpened(true)
                                        setTimeout(() => {
                                            setOpened(false)
                                        }, 1000)
                                    }}
                                />
                            </div>
                        </Tooltip>
                    </Popover.Target>

                    <Popover.Dropdown>
                        <p className={"text-center text-base"}>Copied!</p>
                    </Popover.Dropdown>
                </Popover>
            </div>
        </div>
    )
}

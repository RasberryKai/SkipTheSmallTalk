import { IconClipboard, IconHome } from "@tabler/icons"
import { useSelector } from "react-redux"
import { Popover, Tooltip } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router"
import { RootState } from "../../types"

export default function ActionBar() {
    const navigate = useNavigate()
    const currentCard = useSelector((state: RootState) => state.game.currentCard)
    const levelNumber = useSelector((state: RootState) => state.game.level)
    const cardsDone = useSelector((state: RootState) => state.game.cardsDone)
    const cardsLeft = useSelector((state: RootState) => state.game.cardsLeft)

    const [opened, setOpened] = useState<boolean>(false)
    const size = 25

    return (
        <div className={"flex flex-col text-white mt-4"}>
            <p className={"font-bold mb-2 select-none"}>
                LEVEL {levelNumber} - {1 + cardsDone.length} / {1 + cardsDone.length + cardsLeft.length}
            </p>
            <div className={"flex flex-row justify-center"}>
                <Tooltip label={"Home"}>
                    <div>
                        <IconHome size={size} onClick={() => navigate("/")} className={"hover:cursor-pointer "} />
                    </div>
                </Tooltip>
                <Popover opened={opened} withArrow>
                    <Popover.Target>
                        <div className={"ml-6 hover:cursor-pointer"}>
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
                    </Popover.Target>

                    <Popover.Dropdown>
                        <p className={"text-center text-base"}>Copied!</p>
                    </Popover.Dropdown>
                </Popover>
            </div>
        </div>
    )
}

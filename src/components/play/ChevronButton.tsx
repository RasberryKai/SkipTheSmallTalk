import RoundIconButton from "./RoundIconButton"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons"

interface ChevronButtonProps {
    direction: "left" | "right"
    onClick: () => void
}

export default function ChevronButton(props: ChevronButtonProps) {
    return (
        <RoundIconButton onClick={props.onClick}>
            {props.direction === "left" ? (
                <IconChevronLeft size={45} color={"#464545"} className={"mr-2 active:scale-95 transition-all duration-200"} />
            ) : (
                <IconChevronRight size={45} color={"#464545"} className={"ml-2 active:scale-95 transition-all duration-200"} />
            )}
        </RoundIconButton>
    )
}

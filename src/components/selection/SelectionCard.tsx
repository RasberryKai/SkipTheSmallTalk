interface SelectionCardProps {
    name: string
    description: string
    onClick?: () => void
}

export default function SelectionCard(props: SelectionCardProps) {
    return (
        <div
            className={"w-full h-44 bg-accent rounded-xl flex flex-col items-center justify-start p-2 mb-4 select-none"}
            onClick={props.onClick}
        >
            <p className={"text-2xl text-black font-bold text-center"}>{props.name}</p>
            <p className={"text-base text-black mt-4 mr-4 ml-4 text-center"}>{props.description}</p>
        </div>
    )
}

import { ReactNode } from "react"

interface AuthContainerProps {
    children: ReactNode
    onSubmit: () => void
}

export default function AuthContainer(props: AuthContainerProps) {
    return (
        <div className={"w-full h-screen flex flex-col items-center justify-center pb-32"}>
            <form
                className={"w-11/12 h-2/3 bg-gray rounded-xl flex flex-col items-center pt-6 pl-4 pr-4"}
                onSubmit={props.onSubmit}
            >
                {props.children}
            </form>
        </div>
    )
}

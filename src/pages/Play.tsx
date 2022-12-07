import { Link } from "react-router-dom"
import { IconArrowBackUp } from "@tabler/icons"
import NavigationBar from "../components/play/NavigationBar"
import ActionBar from "../components/play/ActionBar"
import QuestionCard from "../components/play/QuestionCard"

export default function Play() {
    // check redux store
    // if no game, navigate to home
    return (
        <div className={"w-full h-screen flex flex-col items-center"}>
            {/* Backlink */}
            <div className={"w-full flex flex-row justify-start"}>
                <Link to={"/"} className={"text-xl text-grey flex flex-row items-center"}>
                    <IconArrowBackUp />
                    <p className={"underline underline-offset-1 ml-2"}>Home</p>
                </Link>
            </div>
            <div className={"w-full h-full flex flex-col justify-center items-center pb-52"}>
                <QuestionCard />
                <NavigationBar />
                <ActionBar />
            </div>
        </div>
    )
}

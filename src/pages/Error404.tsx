import { useNavigate } from "react-router"

export default function Error404() {
    const navigate = useNavigate()

    return (
        <div className={"w-full h-screen bg-errorPage flex flex-col justify-center items-center pb-36"}>
            <p className={"text-4xl text-white mb-2"}>404 Error</p>
            <p className={"text-lg text-white mb-2"}>Page not found</p>
            <img src={require("../assets/404Design.jpg")} alt={"404 not found"} className={"mb-8"} />
            <p onClick={() => navigate("/")} className={"text-white text-2xl underline"}>
                Go back to home
            </p>
        </div>
    )
}

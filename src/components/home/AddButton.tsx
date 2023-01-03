import { useNavigate } from "react-router"

export default function AddButton() {
    const navigate = useNavigate()

    return (
        <div className={"h-28 w-28 mt-4 glasmorphism flex justify-center items-center"}>
            <img
                className={"h-20 w-auto"}
                alt={"Add Button"}
                src={require("../../assets/AddButton.png")}
                onClick={() => navigate("/addGame")}
            />
        </div>
    )
}

import { useNavigate } from "react-router"

export default function AddButton() {
    const navigate = useNavigate()

    return (
        <img
            className={"h-28 w-auto mt-4"}
            alt={"Add Button"}
            src={require("../../assets/AddButton.png")}
            onClick={() => navigate("/addGame")}
        />
    )
}

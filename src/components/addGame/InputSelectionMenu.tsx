import { Menu } from "@mantine/core"
import React, { Dispatch, SetStateAction } from "react"
import { Button } from "@mantine/core"
import { DynamicInput } from "../../types"

export default function InputSelectionMenu(props: {
    inputs: DynamicInput[]
    setInputs: Dispatch<SetStateAction<DynamicInput[]>>
}) {
    const handleNewInput = (type: "name" | "user") => {
        const values = [...props.inputs]
        values.push({ type: type, value: "" })
        props.setInputs(values)
    }

    return (
        <Menu withArrow>
            <Menu.Target>
                <Button className={"h-10 rounded-md w-1/3 bg-white text-primary-dark active:bg-white"}>Add</Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Want to add an existing User?</Menu.Label>
                <Menu.Item onClick={() => handleNewInput("name")}>Just add a Name</Menu.Item>
                <Menu.Item onClick={() => handleNewInput("user")}>Add an existing User</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

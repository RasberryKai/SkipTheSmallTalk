export default function Container(props: any) {
    return <div className={"w-screen h-full min-h-screen bg-primary-dark p-4"}>{props.children}</div>
}

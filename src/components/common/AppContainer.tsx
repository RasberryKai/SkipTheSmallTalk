export default function AppContainer(props: any) {
    return <div className={"w-screen h-screen min-h-screen bg-primary-dark p-4"}>{props.children}</div>
}

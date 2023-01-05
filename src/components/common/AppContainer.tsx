export default function AppContainer(props: any) {
    document.body.classList.add("bg-primary-darker")
    const width = window.innerWidth
    return (
        <div className={`w-full max-w-[500px] ${width >= 500 ? "rounded-2xl" : ""} h-full min-h-screen bg-primary-dark p-4`}>
            {props.children}
        </div>
    )
}

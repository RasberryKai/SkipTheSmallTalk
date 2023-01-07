export default function AppContainer(props: any) {
    document.body.classList.add("bg-primary-darker")
    document.body.style.overflow = "hidden"
    const width = window.innerWidth
    return (
        <div
            className={`w-full max-w-[500px] ${
                width >= 500 ? "rounded-2xl" : ""
            } h-screen min-h-screen bg-primary-dark p-4 overflow-scroll`}
        >
            {props.children}
        </div>
    )
}

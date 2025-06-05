export default function Message(){
    const handleClick = () => {
        console.log("Click")
    }
    return (
        <dir>
            <button onClick={() => {console.log("Clickkkkkk")}}>
                Click me
            </button>
        </dir>
    )
}
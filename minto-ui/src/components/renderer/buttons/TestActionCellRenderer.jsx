const TestActionCellRenderer = (params) => {
    const handleClick = () => {
        const data = params.data
        params.context.returnData(data)
    }
    return (
        <>
            <button className="btn btn-outline-primary btn-sm mx-2" onClick={handleClick}>
                Click Me
            </button>
        </>
    )
}

export default TestActionCellRenderer
import { Binoculars, PenFill, TrashFill } from "react-bootstrap-icons"

const ActionCellRenderer = (params) => {

    const handleClick = () => {
        const data = params.data
        params.context.returnData(data)
    }

    return (
        <>
            <button className="btn btn-primary btn-sm mx-2" 
                title="View User Details"
                onClick={() => {
                    params.setViewUser(true)
                    handleClick()
                }}
            >
                <Binoculars />
            </button>
            <button className="btn btn-outline-primary btn-sm mx-2" 
                title="Edit User"
                onClick={() => {
                    params.setViewUser(false)
                    handleClick()
                }}
            >
                <PenFill />
            </button>
            { 
                (params.user.decoded.role === 'Admin') && (
                    <button className="btn btn-danger btn-sm mx-2"
                        title="Delete User" 
                        onClick={() => {
                            params.setViewUser(false)
                            params.deleteUser(params.data.email)
                        }}
                    >
                        <TrashFill />
                    </button>
                )
            }
        </>
    )
}

export default ActionCellRenderer

import { Binoculars, PenFill, TrashFill } from "react-bootstrap-icons";

const PersonActionCell = (params) => {

    const handleClick = () => {
        const data = params.data
        params.context.returnData(data)
    }
    
    return (
        <>
            <button className="btn btn-primary btn-sm mx-2" 
                title="View Person Details"
                onClick={() => {
                    params.setViewPerson(true)
                    handleClick()
                }}
            >
                <Binoculars />
            </button>
            { 
                (params.user.decoded.role === 'Admin') && (
                    <button className="btn btn-outline-primary btn-sm mx-2" 
                        title="Edit Person"
                        onClick={() => {
                            params.setViewPerson(false)
                            handleClick()
                        }}
                    >
                        <PenFill />
                    </button>
                )
            }
    
            { 
                (params.user.decoded.role === 'Admin') && (
                    <button className="btn btn-danger btn-sm mx-2" 
                        title="Delete Person"
                        onClick={() => {
                            params.setViewPerson(false)
                            params.deletePerson(params.data.id)
                        }}
                    >
                        <TrashFill />
                    </button>
                )
            }
        </>
    )
}

export default PersonActionCell


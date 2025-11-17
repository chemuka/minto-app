import { Binoculars, PenFill, TrashFill } from 'react-bootstrap-icons';

const MembersActionCell = (params) => {

    const handleClick = () => {
        const data = params.data
        params.context.returnData(data)
    }

    return (
        <>
            <button className="btn btn-primary btn-sm mx-2" 
                title="View Member Details"
                onClick={() => {
                    params.setViewMember(true)
                    handleClick()
                }}
            >
                <Binoculars />
            </button>
            { 
                (params.user.decoded.role === 'Admin') && (
                    <button className="btn btn-outline-primary btn-sm mx-2" 
                        title="Edit Member"
                        onClick={() => {
                            params.setViewMember(false)
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
                        title="Delete Member"
                        onClick={() => {
                            params.setViewMember(false)
                            params.deleteMember(params.data.id)
                        }}
                    >
                        <TrashFill />
                    </button>
                )
            }
        </>
    )
}

export default MembersActionCell
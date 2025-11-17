import { Binoculars, PenFill, TrashFill } from 'react-bootstrap-icons';

const ApplicationsActionCell = (params) => {

    const handleClick = () => {
        const data = params.data
        params.context.returnData(data)
    }

    return (
        <>
            <button className="btn btn-primary btn-sm mx-2" 
                title="View Application Details"
                onClick={() => {
                    params.setViewApplication(true)
                    handleClick()
                }}
            >
                <Binoculars />
            </button>
            { 
                (params.user.decoded.role === 'Admin') && (
                    <button className="btn btn-outline-primary btn-sm mx-2" 
                        title="Edit Application"
                        onClick={() => {
                            params.setViewApplication(false)
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
                        title="Delete Application"
                        onClick={() => {
                            params.setViewApplication(false)
                            params.deleteApplication(params.data.id)
                        }}
                    >
                        <TrashFill />
                    </button>
                )
            }
        </>
    )
}

export default ApplicationsActionCell
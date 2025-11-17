import { Binoculars, PlusLg } from 'react-bootstrap-icons';

const RefereesActionCell = (params) => {

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
            <button className="btn btn-success btn-sm mx-2" 
                title="Edit Member"
                onClick={() => {
                    params.setViewMember(false)
                    handleClick()
                }}
            >
                <PlusLg />
            </button>
        </>
    )
}

export default RefereesActionCell
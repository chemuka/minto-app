import MembershipForm from "../../membership/MembershipForm"

const AddApplicationPage = () => {
    return (
        <>
            <div className="container mt-5 pt-2">
                <MembershipForm title={'New Membership Application'} headerBgColor={'bg-primary'} cardBorderColor={'border-primary'} />
            </div>
        </>
    )
}

export default AddApplicationPage

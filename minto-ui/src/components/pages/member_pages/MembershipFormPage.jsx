import MembershipForm from "../../membership/MembershipForm"

const MembershipFormPage = () => {
    return (
        <>
            <div className="container mt-5 pt-2">
                <MembershipForm title={'New Membership Application'} headerBgColor={'bg-danger'} cardBorderColor={'border-danger'} />
            </div>
        </>
    )
}

export default MembershipFormPage

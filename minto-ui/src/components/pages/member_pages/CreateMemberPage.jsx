import CreateMember from "../../membership/CreateMember"

const CreateMemberPage = () => {
    return (
        <>
            <div className="container mt-5 pt-2">
                <CreateMember title={'Create Member Application'} headerBgColor={'bg-danger'} cardBorderColor={'border-danger'} />
            </div>
        </>
    )
}

export default CreateMemberPage

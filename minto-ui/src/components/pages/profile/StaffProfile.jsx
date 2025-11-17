import { useAuth } from "../../hooks/useAuth";
import ViewAllUsers from "../../users/ViewAllUsers";

const StaffProfile = () => {
    const { getUser } = useAuth()
    let user = getUser()

    return (
        <div className="container mt-5 pt-4">
            {user ? (
                <>
                    <div className='p-5 text-center bg-light h-100'>
                        <h1>Welcome, {user.decoded.role}: {user.decoded.firstName} {user.decoded.lastName}!</h1>
                        <p>Email: {user.decoded.sub}</p>
                    </div>
                    <ViewAllUsers />
                </>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
};

export default StaffProfile
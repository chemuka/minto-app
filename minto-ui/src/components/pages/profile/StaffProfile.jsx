import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Profile from "./Profile";
import { defaultMember } from "../../../model/defaultMember";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";


const StaffProfile = () => {
    const { getUser } = useAuth()
    const { fetchWithAuth } = useFetch()
    const [memberData, setMemberData] = useState({ ...defaultMember })
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        loadMember()
    }, [])
    
    const loadMember = async () => {
        setIsLoading(true)
        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/members/dto/email/${user.decoded.sub}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            
            if (!response.ok) {
                const responseObject = await response.json()
                console.log(response.status)
                toast.error('Error: ' + responseObject.message)
                throw new Error(responseObject.message)
            }
            const memberResponse = await response.json()
            setMemberData(memberResponse);
            console.log('memberResponse:', memberResponse)
            toast.success('Member profile data loaded successfully!')
        } catch(error) {
            console.log(error)
            toast.error('Error loading member data. ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Profile />
        </>
    )
};

export default StaffProfile
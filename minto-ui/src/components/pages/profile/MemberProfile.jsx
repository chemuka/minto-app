import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoadingSpinner from '../../loading/LoadingSpinner'
import MemberProfileCard from './MemberProfileCard'
import useFetch from '../../hooks/useFetch'
import { useAuth } from '../../hooks/useAuth'

const DEFAULT_USER = {
    firstName: '',
    lastName: '', 
    email: '', 
    role: '', 
    source: '', 
    picture: '',
    createdAt: '', 
    updatedAt: ''
}

const DEFAULT_MEMBER = {
    id: 0,
    userId: 0,
    memberCreatedAt: "",
    memberUpdatedAt: "",
    application: {
        id: 0,
        appCreatedAt: "",
        appUpdatedAt: "",
        applicationStatus: "",
        maritalStatus: "",
        person: {
            id: 0,
            firstName: "",
            middleName: "",
            lastName: "",
            dob: "",
            lifeStatus: "",
            createdAt: "",
            updatedAt: "",
            contact: {
                id: 0,
                addresses: [{ id: 0, type: "", street: "", city: "", state: "", zipcode: "", country: "" }],
                emails: [{ id: 0, type: "", address: "" }],
                phones: [{ id: 0, type: "", countryCode: "", number: "" }]
            }
        },
        beneficiaries: [],
        children: [],
        parents: [],
        referees: [],
        relatives: [],
        siblings: [],
        spouses: [],
    }
}

const MemberProfile = () => {
    const { fetchWithAuth } = useFetch()
    const { getUser, isAuthenticated } = useAuth()
    const [userData, setUserData] = useState(DEFAULT_USER)
    const [memberData, setMemberData] = useState(DEFAULT_MEMBER)
    const [isLoading, setIsLoading] = useState(false)
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    // First fetch call
                    const response1 = await fetchWithAuth(`http://localhost:8080/api/v1/users/${user.decoded.sub}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response1.ok) {
                        console.log("[Profile] - Testing ... line 77")
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const userResponse = await response1.json()
                    setUserData(userResponse);
                    //console.log('userResponse:', userResponse)
                    toast.success('User profile data loaded successfully!')

                    // Second fetch call
                    const response2 = await fetchWithAuth(`http://localhost:8080/api/v1/members/email/${user.decoded.sub}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response2.ok) {
                        console.log("[Profile] - Testing ... line 96")
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const memberResponse = await response2.json()
                    setMemberData(memberResponse);
                    //console.log('memberResponse:', memberResponse)
                    toast.success('Member profile data loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
                toast.error('Error loading User and Member profile data. ' + error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
        
        return () => {
            console.log("Cleaned up after fetchData in Profile!");
          }
    }, [user, fetchWithAuth])

    return (
        <>
            <div>
            {
                isLoading ? (
                    <LoadingSpinner caption={'Members Profile'} clsTextColor={"text-danger"} />
                ) : (
                    isAuthenticated && (
                        <>
                            <div className="container mt-5 mb-3 pt-4">
                                <MemberProfileCard userData={userData} memberData={memberData} />
                            </div>
                        </>
                    )
                )
            }
            </div>
        </>
    )
}

export default MemberProfile

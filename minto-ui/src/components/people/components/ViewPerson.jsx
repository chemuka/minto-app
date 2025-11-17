import { useEffect, useState } from "react"
import { toast } from "sonner"
import PropTypes from 'prop-types'
import LoadingSpinner from "../../loading/LoadingSpinner"
import ViewPersonCard from "../../person/components/ViewPersonCard"
import { useAuth } from "../../hooks/useAuth"
import useFetch from "../../hooks/useFetch"

const DEFAULT_PERSON = {
    id: 0,
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    lifeStatus: "",
    contact: {
        addresses: [{ type: "", street: "", city: "", state: "", zipcode: "", country: "" }],
        emails: [{ type: "", address: "" }],
        phones: [{ type: "", countryCode: "", number: "" }]
    }
}

const ViewPerson = (props) => {
    const { formData } = props
    const [viewPersonData, setViewPersonData] = useState(DEFAULT_PERSON)
    const { getUser, isAuthenticated } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const { fetchWithAuth } = useFetch()
    let user = getUser()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                if((formData.id > 0) && user) {
                    const response = await fetchWithAuth(`http://localhost:8080/api/v1/people/${formData.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response.ok) {
                        console.log("[ViewPerson] - Testing ... line 28")
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
                    const data = await response.json()
                    setViewPersonData(data)
                    toast.success('Person data loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch(error) {
                console.log(error)
                toast.error('Error loading person. ' + error.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
        
        return () => {
            console.log("Cleaned up after fetchData in ViewPerson!")
          }
    }, [formData, user, fetchWithAuth])

  return (
    <>
        <div>
            {
                isLoading ? (
                    <LoadingSpinner caption={'View person'} clsTextColor={"text-primary"} />
                ) : (
                    isAuthenticated && (
                        <ViewPersonCard arrayPerson={viewPersonData} personType={'Person'} />
                    )
                )
            }
        </div>
    </>
  )
}

ViewPerson.propTypes = {
    formData: PropTypes.object,
}

export default ViewPerson

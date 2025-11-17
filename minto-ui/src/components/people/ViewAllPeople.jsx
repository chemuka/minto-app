import { AgGridReact } from "ag-grid-react"
import { useEffect, useMemo, useState } from "react"
import LoadingSpinner from "../loading/LoadingSpinner"
import { toast } from 'sonner'
import { PeopleFill } from "react-bootstrap-icons"
import { useAuth } from "../hooks/useAuth"
import useFetch from "../hooks/useFetch"


const ViewAllPeople = () => {
    const { fetchWithAuth } = useFetch()
    const { getUser, isAuthenticated } = useAuth()
    const [rowData, setRowData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAdminOrStaff, setIsAdminOrStaff] = useState(false)
    let user = getUser()

    useEffect(() => {
        const isUserAdminOrStaff = () => {
            if (user !== null) {
                if ((user.decoded.role === 'Admin') || (user.decoded.role === 'Staff'))
                    return true;
                else
                    return false;
            }
        }

        const loadPeople = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    const response = await fetchWithAuth("http://localhost:8080/api/v1/people", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    
                    if (!response.ok) {
                        console.log("[ViewAllPeople] - Testing ... line 28")
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
            
                    const peopleData = await response.json()
                    //console.log(peopleData)
                    setRowData(peopleData)
                    toast.success('People loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch (error) {
                console.log('[ERROR]:- '+ error)
                toast.error('Error loading people. ' + error.message)
            } finally {
                setIsLoading(false);
            }
        }
        setIsAdminOrStaff(isUserAdminOrStaff())
        loadPeople()
    }, [user, fetchWithAuth])

    const columnDefs = useMemo(() => {
        return [
            { field: 'id', headerName: 'Person Id', filter: true, floatingFilter: true },
            { field: 'firstName', headerName: 'First Name', filter: true, floatingFilter: true },
            { field: 'middleName', headerName: 'Middle Name', filter: true, floatingFilter: true },
            { field: 'lastName', headerName: 'Last Name', filter: true, floatingFilter: true },
            { field: 'dob', headerName: 'DOB', filter: true, floatingFilter: true },
            { field: 'lifeStatus', headerName: 'Life Status', filter: true, floatingFilter: true },
            { field: 'createdAt', headerName: 'Created At', filter: true, floatingFilter: true },
            { field: 'updatedAt', headerName: 'Updated At', filter: true, floatingFilter: true },
        ];
    }, [])

    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 105,
        columnLimits: [
            {
                colId: 'createdAt',
                minWidth: 180
            },
            {
                colId: 'updatedAt',
                minWidth: 180
            }
        ]
    };

    return (
        <div className="container mt-3 pt-2 px-0">
            { 
                isLoading ? (
                    <LoadingSpinner caption={'View all people'} clsTextColor={"text-info"} />
                ) : (
                    isAuthenticated && isAdminOrStaff ? (
                        <div className='card mx-auto border border-info shadow' style={{height: 740}} >
                            <div className='card-header bg-info'>
                                <div className="d-flex">
                                    <PeopleFill size={28} className='me-2' />
                                    <h4>List All People</h4>
                                </div>
                            </div> 
                            <div className='card-body'>
                                <h5 className='text-center'>Person Details</h5>
                                <div className="ag-theme-quartz" style={{ width: '100%', height: '90%' }} >
                                    <AgGridReact 
                                        autoSizeStrategy={autoSizeStrategy}
                                        rowData={rowData}
                                        columnDefs={columnDefs}
                                        pagination={true}
                                        paginationPageSize={10}
                                        paginationPageSizeSelector={[10, 20, 50]}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-center text-primary">Unauthorized</h3>
                        </div>
                    )
                ) 
            }
        </div>
    )
}

export default ViewAllPeople;
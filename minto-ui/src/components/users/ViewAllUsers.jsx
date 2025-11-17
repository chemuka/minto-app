import { AgGridReact } from "ag-grid-react"
import { useEffect, useMemo, useState } from "react"
import LoadingSpinner from "../loading/LoadingSpinner"
import { toast } from 'sonner'
import { useAuth } from "../hooks/useAuth"
import useFetch from "../hooks/useFetch"


const ViewAllUsers = () => {
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated, getUser } = useAuth()
    const [rowData, setRowData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAdminOrStaff, setIsAdminOrStaff] = useState(false)
    let user = getUser()

    useEffect(() => {
        const isUserAdminOrStaff = () => {
            if (user !== null) {
                if ((user.decoded.role === 'Admin') || (user.decoded.role === 'Staff'))
                    return true
                else
                    return false
            }
        }

        const loadUsers = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    const token = user.accessToken
                    const response = await fetchWithAuth("http://localhost:8080/api/v1/users", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    })
                    
                    if (!response.ok) {
                        console.log("[ViewAllUsers] - Testing ... line 28")
                        toast.error('HTTP Error: Network response not OK!')
                        throw new Error('Network response was not ok!')
                    }
            
                    const usersData = await response.json()
                    //console.log(usersData)
                    setRowData(usersData)
                    toast.success('Users loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch (error) {
                console.log('[ERROR]:- '+ error)
                toast.error('Error loading users. ' + error.message)
            } finally {
                setIsLoading(false)
            }
        }
        
        setIsAdminOrStaff(isUserAdminOrStaff())
        loadUsers()
    }, [user, fetchWithAuth])

    // Filter out admin users
    // const nonAdminUsers = rowData.filter(user => user.role !== 'ADMIN')
    // Filter out admin and staff users
    const nonAdminUsers = rowData.filter(user => (user.role !== 'ADMIN' && user.role !== 'STAFF'))

    const columnDefs = useMemo(() => {
        return [
            { field: 'id', headerName: 'Id', filter: true, floatingFilter: true },
            { field: 'firstName', headerName: 'First Name', filter: true, floatingFilter: true },
            { field: 'lastName', headerName: 'Last Name', filter: true, floatingFilter: true },
            { field: 'email', headerName: 'Email', filter: true, floatingFilter: true },
            { field: 'role', headerName: 'Role', filter: true, floatingFilter: true },
            { field: 'source', headerName: 'Reg Source', filter: true, floatingFilter: true },
            { field: 'createdAt', headerName: 'Created At', filter: true, floatingFilter: true },
            { field: 'updatedAt', headerName: 'Updated At', filter: true, floatingFilter: true },
        ]
    }, [])

    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 105,
        columnLimits: [
            {
                colId: 'email',
                minWidth: 220
            },
            {
                colId: 'createdAt',
                minWidth: 170
            },
            {
                colId: 'updatedAt',
                minWidth: 170
            },
        ]
    }

    return (
        <>
            {
                isAuthenticated && isAdminOrStaff ? (
                    <div className="container my-3 px-0">
                        { 
                            isLoading ? (
                                <LoadingSpinner caption={'View all users'} clsTextColor={"text-black"} />
                            ) : (
                                isAuthenticated ? (
                                    <div className='card mx-auto mb-2 border border-dark shadow' style={{height: 740}} >
                                        <div className='card-header text-white bg-dark'>
                                            <h3>List of Users</h3>
                                        </div> 
                                        <div className='card-body'>
                                            <h5 className='text-center'>User Details</h5>
                                            <div className="ag-theme-quartz" style={{ width: '100%', height: '90%' }} >
                                                { 
                                                    user && (user.decoded.role === 'Admin') ? (
                                                        <AgGridReact 
                                                            autoSizeStrategy={autoSizeStrategy}
                                                            rowData={rowData}
                                                            columnDefs={columnDefs}
                                                            pagination={true}
                                                            paginationPageSize={10}
                                                            paginationPageSizeSelector={[10, 20, 50]}
                                                        />
                                                    ) : (
                                                        <AgGridReact 
                                                            autoSizeStrategy={autoSizeStrategy}
                                                            rowData={nonAdminUsers}
                                                            columnDefs={columnDefs}
                                                            pagination={true}
                                                            paginationPageSize={10}
                                                            paginationPageSizeSelector={[10, 20, 50]}
                                                        />
                                                    )
                                                }
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
                ) : (
                    <div className="container my-3 p-2">
                        <h3 className="text-primary text-center">Unauthorized</h3>
                    </div>
                )
            }
        </>
    )
}

export default ViewAllUsers
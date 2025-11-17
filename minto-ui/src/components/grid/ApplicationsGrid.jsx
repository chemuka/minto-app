import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import { AgGridReact } from "ag-grid-react";
import { toast } from "sonner";
import PropTypes from 'prop-types'
import ApplicationsActionCell from "../renderer/buttons/ApplicationsActionCell";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";

const ApplicationsGrid = (props) => {
    const { setSelectedApplication, setViewApplication, url } = props
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated, getUser } = useAuth()
    const [rowData, setRowData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    let user = getUser()

    useEffect(() => {
        const loadApplications = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    const response = await fetchWithAuth(url, {
                        method: 'GET',
                        credentials: "include",
                    })
                    
                    if (!response.ok) {
                        console.log("[ApplicationsGrid] - Network response was not ok")
                        toast.error('HTTP Error: Network response was NOT ok!')
                        throw new Error('Network response was not ok')
                    }
    
                    const applicationsData = await response.json()
                    //console.log(applicationsData)
                    setRowData(applicationsData)
                    toast.success('Applications loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
                
            } catch(error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        loadApplications()
    }, [user, fetchWithAuth, url])

    const columnDefs = useMemo(() => {
        const deleteApplication = async (id) => {
            let confirmation = window.confirm(`Are you sure you want to DELETE application with applicationId: ${id}?`)
            if(confirmation) {
                try {
                    const response = await fetchWithAuth(`http://localhost:8080/api/v1/applications/${id}`, {
                        method: "DELETE",
                        credentials: "include",
                    })

                    if(response.ok) {
                        console.log(`Application ${id}, deleted successfully.`)
                        toast.success(`Application ${id}, deleted successfully.`)
                    } else {
                        console.error(`Error deleting Application ${id}:`, response.statusText)
                        toast.error(`Failed to delete Application ${id}. Please try again!`)
                    }
                } catch(error) {
                    console.error('Network error during deletion:', error)
                    toast.error('Network error during deletion.')
                }
            }
            //loadMembers();
        };
        return [
            { field: 'id', headerName: 'Id', filter: true, floatingFilter: true },
            { field: 'person.firstName', headerName: 'First Name', filter: true, floatingFilter: true },
            { field: 'person.middleName', headerName: 'Middle Name', filter: true, floatingFilter: true },
            { field: 'person.lastName', headerName: 'Last Name', filter: true, floatingFilter: true },
            { field: 'person.dob', headerName: 'DOB', filter: true, floatingFilter: true },
            { field: 'applicationStatus', headerName: 'App Status', filter: true, floatingFilter: true },
            { field: 'appCreatedAt', headerName: 'Created At', filter: true, floatingFilter: true },
            { field: 'appUpdatedAt', headerName: 'Updated At', filter: true, floatingFilter: true },
            {
                field: 'actions', headerName: 'Actions', cellRenderer: ApplicationsActionCell, 
                cellRendererParams: {
                    user: user,
                    setViewApplication: setViewApplication,
                    deleteApplication: deleteApplication
                    }
                },
        ]
    }, [user, setViewApplication, fetchWithAuth])

    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 105,
        columnLimits: [
            {
                colId: 'appCreatedAt',
                minWidth: 160
            },
            {
                colId: 'appUpdatedAt',
                minWidth: 160
            },
            {
                colId: 'actions',
                minWidth: 180
            }
        ]
    }

    const handleReturnData = (data) => {
        //console.log('Data from cell renderer:', data)
        setSelectedApplication(data)
    }

    const context = {
        returnData: handleReturnData,
    }

    // Simulate data loading
    // setTimeout(() => {
    //     setIsLoading(false);
    // }, 2000);

    return (
        <>
            <div className="my-0" style={{height: 372}}>
                {
                    isLoading ? (
                        <LoadingSpinner caption={'Applications list'} clsTextColor={"text-primary"} />
                    ) : (
                        isAuthenticated && (user.decoded.role === 'Admin' || user.decoded.role === 'Staff') ? (
                            <div className="ag-theme-quartz" style={{ width: '100%', height: '100%' }} >
                                <AgGridReact
                                    autoSizeStrategy={autoSizeStrategy}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    pagination={true}
                                    paginationPageSize={5}
                                    paginationPageSizeSelector={[5, 10, 50]}
                                    context={context}
                                />
                            </div> 
                        ) : (
                            <div>
                                <h3 className="text-center text-primary">Unauthorized</h3>
                            </div>
                        )
                    )
                }
            </div>
        </>
    )
}

ApplicationsGrid.propTypes = {
    setSelectedApplication: PropTypes.func,
    setViewApplication: PropTypes.func,
    url: PropTypes.string,
}

export default ApplicationsGrid

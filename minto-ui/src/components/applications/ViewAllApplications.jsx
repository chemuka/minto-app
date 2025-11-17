import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import { toast } from "sonner";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";

const ViewAllApplications = () => {
    const { fetchWithAuth } = useFetch()
    const { getUser, isAuthenticated } = useAuth()
    const [rowData, setRowData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let user = getUser()

    useEffect(() => {
        const loadApplications = async () => {
            setIsLoading(true);
            try {
                if(user) {
                    const response = await fetchWithAuth("http://localhost:8080/api/v1/applications", {
                        method: 'GET',
                        credentials: 'include',
                    });
                    
                    if (!response.ok) {
                        console.log("[MemberGrid] - Network response was not ok")
                        toast.error('HTTP Error: Network response was NOT ok!')
                        throw new Error('Network response was not ok');
                    }

                    const membersData = await response.json()
                    //console.log(membersData)
                    setRowData(membersData)
                    toast.success('Applications loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
                        
            } catch(error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        };
        loadApplications();
    }, [user, fetchWithAuth]);

    const columnDefs = useMemo(() => {
        return [
            { field: 'id', headerName: ' Application Id', filter: true, floatingFilter: true },
            { field: 'person.firstName', headerName: 'First Name', filter: true, floatingFilter: true },
            { field: 'person.middleName', headerName: 'Middle Name', filter: true, floatingFilter: true },
            { field: 'person.lastName', headerName: 'Last Name', filter: true, floatingFilter: true },
            { field: 'person.dob', headerName: 'DOB', filter: true, floatingFilter: true },
            { field: 'applicationStatus', headerName: 'App Status', filter: true, floatingFilter: true },
            { field: 'appCreatedAt', headerName: 'Created At', filter: true, floatingFilter: true },
            { field: 'appUpdatedAt', headerName: 'Updated At', filter: true, floatingFilter: true },
        ];
    }, []);

    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 100,
        columnLimits: [
            {
                colId: 'appCreatedAt',
                minWidth: 190
            },
            {
                colId: 'appUpdatedAt',
                minWidth: 190
            },
        ]
    };

    // Simulate data loading
    // setTimeout(() => {
    //     setIsLoading(false);
    // }, 2000);

    return (
        <div className="container mt-3 px-0">
            {
                isLoading ? (
                    <LoadingSpinner caption={'Applications List'} clsTextColor={"text-primary"} />
                ) : (
                    isAuthenticated ? (
                        <div className='card mx-auto my-2 border shadow' style={{height: 720}} >
                            <div className='card-header text-white bg-primary'>
                                <h3>List of All Applications</h3>
                            </div> 
                            <div className='card-body'>
                                <h5 className='text-center'>Application Details</h5>
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
    );
}

export default ViewAllApplications

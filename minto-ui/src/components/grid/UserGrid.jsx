import { useEffect, useMemo, useRef, useState } from "react";
import ActionCellRenderer from "../renderer/buttons/ActionCellRenderer";
import { AgGridReact } from "ag-grid-react";
import LoadingSpinner from "../loading/LoadingSpinner";
import PropTypes from 'prop-types';
import { toast } from 'sonner'
import { useAuth } from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";

const UserGrid = (props) => {
    const { setSelectedUser, setViewUser } = props
    const { isAuthenticated, getUser } = useAuth()
    const { fetchWithAuth } = useFetch()
    const gridRef = useRef(null)
    const [rowData, setRowData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let user = getUser()

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true);
            try {
                if(user) {
                    const response = await fetchWithAuth("http://localhost:8080/api/v1/users", {
                        method: 'GET',
                        credentials: "include",
                    });
                    
                    if (!response.ok) {
                        console.log("[UserGrid] - Network response was not ok")
                        toast.error('HTTP Error: Network response was NOT ok!')
                        throw new Error('Network response was not ok');
                    }
            
                    const usersData = await response.json();
                    setRowData(usersData);
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
        };
        loadUsers()
    }, [user, fetchWithAuth])

    // Filter out admin users
    // const nonAdminUsers = rowData.filter(user => user.role !== 'ADMIN')
    // Filter out admin and staff users
    const nonAdminUsers = rowData.filter(user => (user.role !== 'ADMIN' && user.role !== 'STAFF'))

    const columnDefs = useMemo(() => {
        const deleteUser = async (email) => {
            console.log("TODO: Delete user with email address: " + email)
            toast.info('TODO: Delete user with email address: email')
        };
        return [
            { field: 'id', headerName: 'Id', filter: true, floatingFilter: true },
            { field: 'firstName', headerName: 'First Name', filter: true, floatingFilter: true },
            { field: 'lastName', headerName: 'Last Name', filter: true, floatingFilter: true },
            { field: 'email', headerName: 'Email', filter: true, floatingFilter: true },
            { field: 'role', headerName: 'Role', filter: true, floatingFilter: true },
            { field: 'source', headerName: 'Reg Source', filter: true, floatingFilter: true },
            { field: 'createdAt', headerName: 'Created At', filter: true, floatingFilter: true },
            {
                field: 'actions', headerName: 'Actions', cellRenderer: ActionCellRenderer, 
                cellRendererParams: {
                    user: user,
                    setViewUser: setViewUser,
                    deleteUser: deleteUser
                },
             },
        ];
    }, [user, setViewUser])

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
        setSelectedUser(data)
    }

    const context = {
        returnData: handleReturnData,
    }

    return (
        <>
            <div className="my-0" style={{height: 372}}>
                {
                    isLoading ? (
                        <LoadingSpinner caption={'User Details'} clsTextColor={"text-black"} />
                    ) : (
                        isAuthenticated ? (
                            <div className="ag-theme-quartz" style={{ width: '100%', height: '100%' }} >
                                { 
                                    user && (user.decoded.role === 'Admin') ? (
                                        <AgGridReact 
                                            ref={gridRef}
                                            autoSizeStrategy={autoSizeStrategy}
                                            rowData={rowData}
                                            columnDefs={columnDefs}
                                            pagination={true}
                                            paginationPageSize={5}
                                            paginationPageSizeSelector={[5, 10, 50]}
                                            context={context}
                                        />
                                    ) : (
                                        <AgGridReact 
                                            ref={gridRef}
                                            autoSizeStrategy={autoSizeStrategy}
                                            rowData={nonAdminUsers}
                                            columnDefs={columnDefs}
                                            pagination={true}
                                            paginationPageSize={5}
                                            paginationPageSizeSelector={[5, 10, 50]}
                                            context={context}
                                        />
                                    )
                                }
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

UserGrid.propTypes = {
    setSelectedUser: PropTypes.func,
    setViewUser: PropTypes.func,
}

export default UserGrid

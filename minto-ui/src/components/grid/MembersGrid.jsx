import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import { AgGridReact } from "ag-grid-react";
import { toast } from "sonner";
import MembersActionCell from "../renderer/buttons/MembersActionCell";
import PropTypes from 'prop-types'
import useFetch from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";
//import useAuthFetch from "../hooks/useAuthFetch";

const MembersGrid = (props) => {
    const { setSelectedMember, setViewMember } = props
    const { fetchWithAuth } = useFetch()
    //const { authFetch } = useAuthFetch()
    const { isAuthenticated, getUser } = useAuth()
    const [rowData, setRowData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let user = getUser()

    useEffect(() => {
        const loadMembers = async () => {
            setIsLoading(true);
            try {
                if(user) {
                    const response = await fetchWithAuth("http://localhost:8080/api/v1/members/dto", {
                        method: 'GET',
                        credentials: "include",
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
    
                    const membersData = await response.json()
                    //console.log(membersData)
                    setRowData(membersData)
                    toast.success('Members loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
                
            } catch(error) {
                console.log('[Members Grid]:- ' + error.message)
                toast.error('[Members Grid]:- ' + error.message)
            } finally {
                setIsLoading(false);
            }
        }
        loadMembers()
    }, [user, fetchWithAuth]);

    const columnDefs = useMemo(() => {
        const deleteMember = async (id) => {
            await fetchWithAuth(`http://localhost:8080/api/v1/members/${id}`, {
                method: "DELETE",
            });
            //loadMembers();
        };
        return [
            { field: 'id', headerName: 'Id', filter: true, floatingFilter: true },
            { field: 'application.person.firstName', headerName: 'First Name', filter: true, floatingFilter: true },
            { field: 'application.person.middleName', headerName: 'Middle Name', filter: true, floatingFilter: true },
            { field: 'application.person.lastName', headerName: 'Last Name', filter: true, floatingFilter: true },
            { field: 'application.person.dob', headerName: 'DOB', filter: true, floatingFilter: true },
            { field: 'memberCreatedAt', headerName: 'Created At', filter: true, floatingFilter: true },
            { field: 'memberUpdatedAt', headerName: 'Updated At', filter: true, floatingFilter: true },
            {
                field: 'actions', headerName: 'Actions', cellRenderer: MembersActionCell, 
                cellRendererParams: {
                    user: user,
                    setViewMember: setViewMember,
                    deleteMember: deleteMember
                    }
                },
        ]
    }, [user, setViewMember, fetchWithAuth])

    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 105,
        columnLimits: [
            {
                colId: 'application.person.dob',
                minWidth: 120
            },
            {
                colId: 'memberCreatedAt',
                minWidth: 160
            },
            {
                colId: 'memberUpdatedAt',
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
        setSelectedMember(data)
    }

    const context = {
        returnData: handleReturnData,
    }

    return (
        <>
            <div className="my-0" style={{height: 370}}>
                {
                    isLoading ? (
                        <LoadingSpinner caption={'Members list'} clsTextColor={"text-danger"} />
                    ) : (
                        isAuthenticated ? (
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

MembersGrid.propTypes = {
    setSelectedMember: PropTypes.func,
    setViewMember: PropTypes.func,
}

export default MembersGrid

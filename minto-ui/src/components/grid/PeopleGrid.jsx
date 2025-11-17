import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { toast } from "sonner";
import LoadingSpinner from "../loading/LoadingSpinner";
import PersonActionCell from "../renderer/buttons/PersonActionCell";
import PropTypes from 'prop-types';
import useFetch from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";

const PeopleGrid = (props) => {
    const { setSelectedPerson, setViewPerson } = props
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated, getUser } = useAuth()
    const gridRef = useRef(null)
    const [rowData, setRowData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let user = getUser()

    useEffect(() => {
        const loadPeople = async () => {
            setIsLoading(true);
            try {
                if(user) {
                    const response = await fetchWithAuth("http://localhost:8080/api/v1/people", {
                        method: 'GET',
                        credentials: "include",
                    });
                    
                    if (!response.ok) {
                        console.log("[PeopleGrid] - Network response was not ok")
                        toast.error('HTTP Error: Network response was NOT ok!')
                        throw new Error('Network response was not ok');
                    }
            
                    const peopleData = await response.json();
                    setRowData(peopleData);
                    toast.success('People loaded successfully!')
                } else {
                    console.log('User NOT authenticated. Please login.')
                    toast.warning('User NOT authenticated. Please login.')
                }
            } catch (error) {
                console.log('[ERROR]:- '+ error)
                toast.error('Error loading people data. ' + error.message)
            } finally {
                setIsLoading(false);
            }
        }
        loadPeople()
    }, [user, fetchWithAuth])
    
    const columnDefs = useMemo(() => {
        const deletePerson = async (id) => {
            console.log("TODO: Delete person with id: " + id)
            toast.info('TODO: Delete person with id: ' + id)
        };
        return [
            { field: 'id', headerName: 'Person Id', filter: true, floatingFilter: true },
            { field: 'firstName', headerName: 'First Name', filter: true, floatingFilter: true },
            { field: 'middleName', headerName: 'Middle Name', filter: true, floatingFilter: true },
            { field: 'lastName', headerName: 'Last Name', filter: true, floatingFilter: true },
            { field: 'dob', headerName: 'DOB', filter: true, floatingFilter: true },
            { field: 'lifeStatus', headerName: 'Life Status', filter: true, floatingFilter: true },
            { field: 'createdAt', headerName: 'Created At', filter: true, floatingFilter: true },
            {
                field: 'actions', headerName: 'Actions', cellRenderer: PersonActionCell, 
                cellRendererParams: {
                    user: user,
                    setViewPerson: setViewPerson,
                    deletePerson: deletePerson
                    }
                },
        ];
    }, [user, setViewPerson]);

    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 105,
        columnLimits: [
            {
                colId: 'createdAt',
                minWidth: 170
            },
            {
                colId: 'actions',
                minWidth: 180
            }
        ]
    };

    const handleReturnData = (data) => {
        //console.log('Data from cell renderer:', data)
        setSelectedPerson(data)
    }

    const context = {
        returnData: handleReturnData,
    }
    return (
        <>
            <div className="my-0" style={{height: 372}}>
                {
                    isLoading ? (
                        <LoadingSpinner caption={'People Details'} clsTextColor={"text-info"} />
                    ) : (
                        isAuthenticated ? (
                            <div className="ag-theme-quartz" style={{ width: '100%', height: '100%' }} >
                                { 
                                    user && (user.decoded.role === 'Admin' || user.decoded.role === 'Staff') ? (
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
                                        <div>
                                            <h3 className="text-center text-primary">Unauthorized</h3>
                                        </div>
                                    )
                                }
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-center text-info">Unauthorized</h3>
                            </div>
                        )
                    )
                }
            </div>
        </>
    )
}

PeopleGrid.propTypes = {
    setSelectedPerson: PropTypes.func,
    setViewPerson: PropTypes.func,
}

export default PeopleGrid

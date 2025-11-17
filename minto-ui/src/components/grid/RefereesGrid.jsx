import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Spinner } from "react-bootstrap"
import { AgGridReact } from "ag-grid-react"
import { toast } from "sonner"
import RefereesActionCell from "../renderer/buttons/RefereesActionCell"
import PropTypes from 'prop-types'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import useFetch from "../hooks/useFetch"
import { useAuth } from "../hooks/useAuth"

const RefereesGrid = (props) => {
    const { setSelectedMember, setViewMember } = props
    const { fetchWithAuth } = useFetch()
    const { isAuthenticated, getUser } = useAuth()
    const sourceGridRef = useRef(null)
    const [rowData, setRowData] = useState([])
    const [targetRowData, setTargetRowData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    let user = getUser()

    useEffect(() => {
        const loadMembers = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    const response = await fetchWithAuth("http://localhost:8080/api/v1/members", {
                        method: 'GET',
                        credentials: "include",
                    })
                    
                    if (!response.ok) {
                        console.log("[RefereesGrid] - Network response was not ok")
                        toast.error('HTTP Error: Network response was NOT ok!')
                        throw new Error('Network response was not ok')
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
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        }
        loadMembers()
    }, [user, fetchWithAuth])

    const columnDefs = useMemo(() => {
        return [
            { field: 'id', headerName: 'Id', filter: true, floatingFilter: true, checkboxSelection: true, headerClass: 'bg-danger text-white', },
            { field: 'application.person.firstName', headerName: 'First Name', filter: true, floatingFilter: true, headerClass: 'bg-danger text-white', },
            { field: 'application.person.middleName', headerName: 'Middle Name', filter: true, floatingFilter: true, headerClass: 'bg-danger text-white', },
            { field: 'application.person.lastName', headerName: 'Last Name', filter: true, floatingFilter: true, headerClass: 'bg-danger text-white', },
            { field: 'application.person.dob', headerName: 'DOB', filter: true, floatingFilter: true, headerClass: 'bg-danger text-white', },
            { field: 'memberCreatedAt', headerName: 'Created At', filter: true, floatingFilter: true, headerClass: 'bg-danger text-white', },
            {
                field: 'actions', headerName: 'Actions', cellRenderer: RefereesActionCell, 
                cellRendererParams: {
                    user: user,
                    setViewMember: setViewMember
                }, headerClass: 'bg-danger text-white',
            },
        ]
    }, [user, setViewMember])

    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 110,
        columnLimits: [
            {
                colId: 'application.person.dob',
                minWidth: 120
            },
            {
                colId: 'memberCreatedAt',
                minWidth: 120
            },
            {
                colId: 'actions',
                minWidth: 120
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

    const targetColumnDefs = useMemo(() => {
        return [
            { field: 'id', headerName: 'Id', },
            { field: 'application.person.firstName', headerName: 'First Name' },
            { field: 'application.person.middleName', headerName: 'Middle Name' },
            { field: 'application.person.lastName', headerName: 'Last Name' },
            { field: 'application.person.dob', headerName: 'DOB' },
            { field: 'memberCreatedAt', headerName: 'Created At' },
        ]
    }, [])

    const onSelectionChanged = useCallback(() => {
        const selectedRows = sourceGridRef.current.api.getSelectedRows()
        if(selectedRows.length < 3) {
            setTargetRowData(selectedRows)
        } else {
            alert("Max selection reached! You can only select upto 2 referees.")
        }
    }, [])

    return (
        <>
            <div className="my-0" style={{ height: 520}}>
                {
                    isLoading ? (
                        <div className="container mt-5 pt-4">
                            <h3 style={{ color: 'coral' }}>Loading Referees List...</h3>
                            <div className={"d-flex justify-content-center align-items-center"} style={{ height: '30vh', color: 'coral' }}>
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        </div>
                    ) : (
                        isAuthenticated ? (
                            <>
                                <h4 className="fw-bold text-center text-danger">Club Members</h4>
                                <div className="ag-theme-alpine mb-2" style={{ width: '100%', height: '53%' }} >
                                    <AgGridReact
                                        ref={sourceGridRef}
                                        autoSizeStrategy={autoSizeStrategy}
                                        rowData={rowData}
                                        columnDefs={columnDefs}
                                        pagination={true}
                                        paginationPageSize={3}
                                        paginationPageSizeSelector={[3, 10, 50]}
                                        context={context}
                                        rowSelection={'multiple'}
                                        onSelectionChanged={onSelectionChanged}
                                    />
                                </div>
                                <h4 className="fw-bold text-center" style={{ color: 'coral'}}>Selected Referees</h4>
                                <div className="ag-theme-alpine" style={{ width: '100%', height: '30%' }} >
                                    <AgGridReact   
                                        autoSizeStrategy={autoSizeStrategy}
                                        rowData={targetRowData}
                                        columnDefs={targetColumnDefs}
                                    />
                                </div>
                            </>
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

RefereesGrid.propTypes = {
    setSelectedMember: PropTypes.func,
    setViewMember: PropTypes.func,
}

export default RefereesGrid

import { AgGridReact } from 'ag-grid-react';
import PropTypes from 'prop-types'
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { XLg } from 'react-bootstrap-icons';
import LoadingSpinner from '../loading/LoadingSpinner';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';

const MEDIUM_SCREEN_SIZE = 768

const UserSelectionModal = (props) => {
    const { onClose, onAddUser, personType } = props
    const { getUser, isAuthenticated } = useAuth()
    const { fetchWithAuth } = useFetch()
    const sourceGridRef = useRef(null)
    const [availableUsers, setAvailableUsers] = useState([])
    const [selectedModalUser, setSelectedModalUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isMobileScreen, setIsMobileScreen] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    let user = getUser()

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true)
            try {
                if(user) {
                    const response = await fetchWithAuth("http://localhost:8080/api/v1/users", {
                        method: 'GET',
                        credentials: 'include',
                    })
                    
                    if (!response.ok) {
                        console.log("[UserSelectionModal] - Network response was not ok")
                        toast.error('HTTP Error: Network response was NOT ok!')
                        throw new Error('Network response was not ok')
                    }
    
                    const usersData = await response.json()
                    console.log(usersData)
                    setAvailableUsers(usersData)
                    toast.success('Users loaded successfully!')
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

        const handleResize = () => {
            setIsMobileScreen(window.innerWidth < MEDIUM_SCREEN_SIZE)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        loadUsers()

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [user, fetchWithAuth])

    const columnDefs = useMemo(() => {
        return [
            { field: 'id', headerName: 'Id', filter: true, floatingFilter: true, checkboxSelection: true, headerClass: 'bg-dark text-white', },
            { field: 'firstName', headerName: 'First Name', filter: true, floatingFilter: true, headerClass: 'bg-dark text-white', },
            { field: 'lastName', headerName: 'Last Name', filter: true, floatingFilter: true, headerClass: 'bg-dark text-white', },
            { field: 'email', headerName: 'Email', filter: true, floatingFilter: true, headerClass: 'bg-dark text-white', },
            { field: 'role', headerName: 'Role', filter: true, floatingFilter: true, headerClass: 'bg-dark text-white', },
            { field: 'source', headerName: 'Reg Source', filter: true, floatingFilter: true, headerClass: 'bg-dark text-white', },
            { field: 'createdAt', headerName: 'Created At', filter: true, floatingFilter: true, headerClass: 'bg-dark text-white', },
            { field: 'updatedAt', headerName: 'Updated At', filter: true, floatingFilter: true, headerClass: 'bg-dark text-white', },
        ]
    }, [])

    const autoSizeStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 90,
        columnLimits: [
            {
                colId: 'email',
                minWidth: 120
            },
            {
                colId: 'createdAt',
                minWidth: 120
            },
            {
                colId: 'updatedAt',
                minWidth: 120
            }
        ]
    }

    const onSelectionChanged = (event) => {
        const selectedNodes = event.api.getSelectedNodes();
        const currentSelectedUsers = selectedNodes.map(node => node.data);

        if (currentSelectedUsers.length > 1) {
            // Optionally, deselect the oldest selection or show a warning
            //alert('Max selection reached! You can only select up to 1 users to add.')
            setIsDisabled(true)
            toast.error('Max selection reached!', {
                description: 'You can only select up to 1 users to add.',
                action: {
                    label: 'Ok',
                    onClick: () => console.log('Ok clicked on UserSelectionModal'),
                },
            })
            // You might need to programmatically deselect a row here
            // For simplicity, this example just alerts.
        } else if (currentSelectedUsers.length <= 0) {
            setIsDisabled(true)
        } else {
            setSelectedModalUser(currentSelectedUsers[0])
            setIsDisabled(false)
        }
    }

    const handleAddSelected = () => {
        onAddUser(selectedModalUser)
    }

    return (
        <>
            {/* Backdrop for the modal */}
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1039,
                }}
            >
                <div className="my-0" style={{ minHeight: '300px' }} >
                    {
                        isLoading ? (
                            <LoadingSpinner caption={'Users List'} clsTextColor={'text-white'} />
                        ) : (
                            isAuthenticated ? (
                                <>
                                    {/* Modal content */}
                                    <div className='bg-dark p-1 p-md-3'
                                        style={{
                                            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                            border: '1px solid #333', zIndex: 1040, minHeight: '300px', minWidth: '310px'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between">
                                            <h5 className='fw-bold text-dark'>Select {personType}(s) from Users</h5>
                                            <button onClick={onClose} className='btn btn-dark ms-auto me-0 mb-2'>
                                                <XLg />
                                            </button>
                                        </div>
                                        <div 
                                            className='ag-theme-alpine'
                                            style={{ 
                                                width: isMobileScreen ? '300px' : '650px', 
                                                height: '300px', 
                                            }} 
                                        >
                                            <AgGridReact
                                                ref={sourceGridRef}
                                                autoSizeStrategy={autoSizeStrategy}
                                                rowData={availableUsers}
                                                columnDefs={columnDefs}
                                                pagination={true}
                                                paginationPageSize={3}
                                                paginationPageSizeSelector={[3, 10, 50]}
                                                onSelectionChanged={onSelectionChanged}
                                            />
                                        </div>
                                        <div className="d-flex text-center">
                                            <button 
                                                onClick={handleAddSelected} 
                                                disabled={isDisabled}
                                                className='btn btn-success mt-3 mb-2 mx-auto'
                                            >
                                                Add Selected
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='bg-dark p-1 p-md-3'
                                    style={{
                                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                        border: '1px solid #333', zIndex: 1040, minHeight: '300px', minWidth: '310px'
                                    }}
                                >
                                    <div className="d-flex justify-content-between">
                                        <h5 className='fw-bold text-dark'>ERROR: Select {personType}(s)</h5>
                                        <button onClick={onClose} className='btn btn-dark ms-auto me-0 mb-2'>
                                            <XLg />
                                        </button>
                                    </div>
                                    <div>
                                        <h6 className="text-center text-primary">Unauthorized! Please log in.</h6>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </>
    )
}

UserSelectionModal.propTypes = {
    onClose: PropTypes.func, 
    onAddUser: PropTypes.func,
    personType: PropTypes.string,
}

export default UserSelectionModal

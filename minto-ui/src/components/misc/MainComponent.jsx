// MainComponent.js
import { useCallback, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import MemberSelectionModal from '../members/MemberSelectionModal'

function MainComponent() {
    const gridRef = useRef()
    const [selectedMembers, setSelectedMembers] = useState([])
    const [showModal, setShowModal] = useState(false)

    const targetColumnDefs = [
        { field: 'id', headerName: 'Id', checkboxSelection: true, },
        { field: 'application.person.firstName', headerName: 'First Name' },
        { field: 'application.person.middleName', headerName: 'Middle Name' },
        { field: 'application.person.lastName', headerName: 'Last Name' },
        { field: 'application.person.dob', headerName: 'DOB' },
        { field: 'memberCreatedAt', headerName: 'Created At' },
    ]

    const handleAddMembers = (membersToAdd) => {
        // Logic to add membersToAdd to selectedMembers, ensuring no duplicates and handling the limit if needed
        setSelectedMembers((prevMembers) => {
            const newMembers = [...prevMembers]
            membersToAdd.forEach(member => {
                if (!newMembers.some(m => m.id === member.id)) {
                newMembers.push(member)
                }
            })
            return newMembers
        })
        setShowModal(false)
    }

    const onGridReady = useCallback((params) => {
        gridRef.current = params.api
    }, [])

    const removeSelected = useCallback(() => {
        if(!gridRef.current) return

        const selectedNodes = gridRef.current.getSelectedNodes()
        const selectedIds = selectedNodes.map(node => node.data.id)

        const newData = selectedMembers.filter(row => !selectedIds.includes(row.id))
        setSelectedMembers(newData)
    }, [selectedMembers])

    return (
        <div className=''>
            <button 
                onClick={() => setShowModal(true)}
                className='btn btn-success me-1 my-2'
            >
                Add Referee(s)
            </button>
            <button 
                onClick={removeSelected}
                className='btn btn-danger ms-1 my-2'
            >
                Remove Selected
            </button>
             <h4 className="fw-bold text-center" style={{ color: 'coral'}}>Selected Referees</h4>
            <div className="ag-theme-alpine" style={{ width: '100%', height: 180 }} >
                <AgGridReact
                    rowData={selectedMembers}
                    columnDefs={targetColumnDefs}
                    rowSelection={'multiple'}
                    onGridReady={onGridReady}
                />
            </div>

            {showModal && (
                <MemberSelectionModal
                    onClose={() => setShowModal(false)}
                    onAddMembers={handleAddMembers}
                />
            )}
        </div>
    )
}

export default MainComponent
import { useRef, useState } from "react"
import TestActionCellRenderer from "../renderer/buttons/TestActionCellRenderer"
import { AgGridReact } from "ag-grid-react"

const MyGridComponent = () => {
    const gridRef = useRef(null)
    const [rowData, setRowData] = useState([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
    ])

    const handleReturnData = (data) => {
        console.log('Data from cell renderer:', data)
        alert(JSON.stringify(data))
    }

    const columnDefs = [
        { field: 'id' },
        { field: 'name' },
        { 
            headerName: 'Actions',
            cellRenderer: 'testActionCellRenderer',
        },
    ]

    const defaultColDef = {
        flex: 1,
    }

    const context = {
        returnData: handleReturnData,
    }

    return (
        <>
            <div className="ag-theme-alpine" style={{ height: '15rem', width: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    components={{
                        testActionCellRenderer: TestActionCellRenderer,
                    }}
                    context={context}
                />
            </div>  
        </>
    )
}

export default MyGridComponent

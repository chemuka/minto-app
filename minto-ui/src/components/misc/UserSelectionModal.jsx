// UserSelectionModal.js
import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import PropTypes from 'prop-types'

function UserSelectionModal(props) {
    const { onClose, onAddUsers } = props
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedModalUsers, setSelectedModalUsers] = useState([]);

  useEffect(() => {
    // Fetch user data here (e.g., from an API)
    const fetchedUsers = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'David' },
    ];
    setAvailableUsers(fetchedUsers);
  }, []);

  const modalGridColDefs = [
    { field: 'id', headerName: 'ID', checkboxSelection: true },
    { field: 'name', headerName: 'Name' },
    // ... other columns for modal grid
  ];

  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const currentSelectedUsers = selectedNodes.map(node => node.data);

    if (currentSelectedUsers.length > 2) {
      // Optionally, deselect the oldest selection or show a warning
      alert('You can only select up to 2 users.');
      // You might need to programmatically deselect a row here
      // For simplicity, this example just alerts.
    } else {
      setSelectedModalUsers(currentSelectedUsers);
    }
  };

  const handleAddSelected = () => {
    onAddUsers(selectedModalUsers);
  };

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: 'white', padding: '20px', border: '1px solid #ccc', zIndex: 1000
    }}>
      <h2>Select Users</h2>
      <div className="ag-theme-alpine" style={{ height: 200, width: 400 }}>
        <AgGridReact
          rowData={availableUsers}
          columnDefs={modalGridColDefs}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
        />
      </div>
      <button onClick={handleAddSelected} disabled={selectedModalUsers.length === 0}>Add Selected</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

UserSelectionModal.propTypes = {
    onClose: PropTypes.func, 
    onAddUsers: PropTypes.func,
}

export default UserSelectionModal;
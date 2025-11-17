import { useEffect, useState } from "react";

const UserRolesDropdown = () => {
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');

    useEffect(() => {
    // Fetch enum values from the Java backend
    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/roles'); // Replace with your actual API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(response);
            const data = await response.json();
            setOptions(data);
        } catch (error) {
            console.error("Could not fetch roles:", error);
            // setOptions(['USER', 'MODERATOR', 'ADMIN']); //Fallback in case of error
        }
    };

        fetchRoles();
    }, []);

    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <div>
            <label htmlFor="role-select">Select Role:</label>
            <select id="role-select" value={selectedValue} onChange={handleSelectChange}>
                <option value="">-- Select a role --</option>
                { options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {selectedValue && <p>Selected role: {selectedValue}</p>}
        </div>
    );
};

export default UserRolesDropdown;

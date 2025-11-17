import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useAuth } from "../hooks/useAuth";

const CustomSelect = (props) => {
    const { className, name, value, placeholder, onChange, url, required } = props;
    const { getUser } = useAuth()
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let user = getUser()
  
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                if(user){
                    if(user.decoded.role === 'Admin'){
                        setOptions(data)
                    } else if (user.decoded.role === 'Staff'){
                        const nonAdminStaffOpts = data.filter(role => (role.name !== 'ADMIN' && role.name !== 'STAFF'))
                        setOptions(nonAdminStaffOpts)
                    }
                } else {
                    setOptions([])
                }
                
                
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };
  
        fetchData();
    }, [url, user]);
  
    if (loading) {
        return <p>Loading...</p>;
    }
  
    if (error) {
        return <p>Error: {error.message}</p>;
    }
  
    return (
        <select className={className} name={name} value={value} onChange={onChange} required={required}>
            <option value="" style={{ color: '#999'}}> 
                { placeholder } 
            </option>
            {options.map((option) => (
            <option key={option.name} value={option.name}>
                {option.label}
            </option>
            ))}
        </select>
    );
};

CustomSelect.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    url: PropTypes.string,
    required: PropTypes.bool
};

export default CustomSelect;

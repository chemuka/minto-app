import { useState } from "react"
import PropTypes from 'prop-types';
import { Form, InputGroup } from "react-bootstrap";
import { ArrowClockwise } from "react-bootstrap-icons";

const PasswordGenerator = (props) => {
    const { className, id, name, placeholder, onChange, required } = props;
    const [password, setPassword] = useState('');

    const generatePassword = () => {
        const randSeed = Math.floor(Math.random() * 9);
        const length = 20 - randSeed;
        const numbers = '1234567890';
        const symbols = '!@#$%^&*()_+{}[]|:;<>,.?/~';
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
        chars += numbers;
        chars += symbols;
    
        let generatedPassword = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            generatedPassword += chars[randomIndex];
        }
        setPassword(generatedPassword);
        onChange(generatedPassword)
    };

    const handleTextChange = (e) => {
        setPassword(e.target.value)
        onChange(e.target.value) // Important
        //console.log('Call handle text change')
    }

  return (
    <>
        <InputGroup className={className} size="md">
            <Form.Control
                id={id}
                type={"text"}
                name={name}
                placeholder={placeholder}
                value={password}
                onChange={handleTextChange}
                aria-label={name}
                aria-describedby={name}
                required={required}
            />
            <InputGroup.Text onClick={generatePassword} className="text-info bg-dark" title="Generate password">
                <ArrowClockwise size={22} />
            </InputGroup.Text>
        </InputGroup>
    </>
  )
};

PasswordGenerator.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool
};

export default PasswordGenerator

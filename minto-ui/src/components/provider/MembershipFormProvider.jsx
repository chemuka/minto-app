import { useState } from "react"
import PropTypes from 'prop-types';
import MembershipFormContext from "../context/MembershipFormContext";

const MembershipFormProvider = ({ children }) => {

    const [formData, setFormData] = useState({
        "applicationStatus": "",
        "person": {
            firstName: "",
            middleName: "",
            lastName: "",
            dob: "",
            lifeStatus: "",
            contact: {
                addresses: [],
                emails: [],
                phones: [],
            },
        },
        "maritalStatus": "",
        "parents": [],
        "spouses": [],
        "children": [],
        "siblings": [],
        "referees": [],
        "relatives": [],
        "beneficiaries": [],
    });

    const [person, setPerson] = useState(
        {
            firstName: "",
            middleName: "",
            lastName: "",
            dob: "",
            lifeStatus: "",
            contact: {
                addresses: [],
                emails: [],
                phones: [],
            },
        }
    );

    const [contact, setContact] = useState(
        {
            addresses: [],
            emails: [],
            phones: [],
        }
    );
    /*
    const onInputChange = (e) => {
        setPerson({ ...person, [e.target.name]: e.target.value });
    };
    */
    const updateFormData = (e) => {
        const { field, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const handleAddressChange = (index, field, value) => {
        const updatedAddresses = [...contact.addresses];
        updatedAddresses[index][field] = value;
        setContact({ ...contact, addresses: updatedAddresses });
        setPerson({ ...person, contact: contact });
    };

    const handleEmailChange = (index, field, value) => {
        const updatedEmails = [...contact.emails];
        updatedEmails[index][field] = value;
        setContact({ ...contact, emails: updatedEmails });
        setPerson({ ...person, contact: contact });
    };

    const handlePhoneChange = (index, field, value) => {
        const updatedPhones = [...contact.phones];
        updatedPhones[index][field] = value;
        setContact({ ...contact, phones: updatedPhones });
        setPerson({ ...person, contact: contact });
    };

    const addAddress = () => {
        let newContacts = { ...formData.person.contact };
 
        setContact((prevContacts) => {
          newContacts = { ...prevContacts, addresses: [...prevContacts.addresses, { type: '', street: '', city: '', state: '', zipcode: '', country: '' }] };
          return newContacts;
        });

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
    };

    const removeAddress = (id) => {
        let newContacts = { ...contact };
        console.log("Address Id: " + id);
        setContact((prevContacts) => {
            const updatedAddresses = [...prevContacts.addresses];
            updatedAddresses.splice(id, 1);
            newContacts = { ...prevContacts, addresses: updatedAddresses };
            return newContacts;
        });

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
    };

    const addEmail = () => {
        let newContacts = { ...contact };
        
        setContact((prevContacts) => {
          newContacts = { ...prevContacts, emails: [...prevContacts.emails, { type: '', address: '' }] };
          return newContacts;
        });

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
    };

    const removeEmail = (id) => {
        let newContacts = { ...contact };
        console.log("Email Id: " + id);
        setContact((prevContacts) => {
            const updatedEmails = [...prevContacts.emails];
            updatedEmails.splice(id, 1);
            newContacts = { ...prevContacts, emails: updatedEmails };
            return newContacts;
        });

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
    }

    const addPhone = () => {
        let newContacts = { ...contact };
        
        setContact((prevContacts) => {
          newContacts = { ...prevContacts, phones: [...prevContacts.phones, { type: '', countryCode: '',  number: '' }] };

          return newContacts;
        });

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
    };

    const removePhone = (id) => {
        let newContacts = { ...contact };
        console.log("Phone Id: " + id);
        setContact((prevContacts) => {
            const updatedPhones = [...prevContacts.phones];
            updatedPhones.splice(id, 1);
            newContacts = { ...prevContacts, phones: updatedPhones };
            return newContacts;
        });

        setPerson((prevPerson) => {
            const newPerson = { ...prevPerson, contact: newContacts };
            return newPerson;
        });
    }

    return (
        <MembershipFormContext.Provider value={{ formData, updateFormData, removeAddress, addAddress, 
            handleAddressChange, removeEmail, addEmail, handleEmailChange, removePhone, addPhone, 
            handlePhoneChange }}>
            {children}
        </MembershipFormContext.Provider>
    )
}

MembershipFormProvider.propTypes = {
    children: PropTypes.node
};

export default MembershipFormProvider
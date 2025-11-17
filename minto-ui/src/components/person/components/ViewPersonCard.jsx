import { FilePerson, PersonFill } from "react-bootstrap-icons"
import PropTypes from 'prop-types'
import { useEffect, useState } from "react"
import ViewContactCard from "./ViewContactCard"

const DEFAULT_ARRAY_PERSON = {
    id: 0,
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    lifeStatus: "",
    createdAt: "",
    updatedAt: "",
    contact: {
            id: 0,
        addresses: [{ id: 0, type: "", street: "", city: "", state: "", zipcode: "", country: "" }],
        emails: [{ id: 0, type: "", address: "" }],
        phones: [{ id: 0, type: "", countryCode: "", number: "" }]
    }
}

const ViewPersonCard = (props) => {
    const { arrayPerson, title } = props
    const [viewPersonData, setViewPersonData] = useState(DEFAULT_ARRAY_PERSON)
    const [showContact, setShowContact] = useState(false)

    useEffect(() => {
        //console.log('arrayPerson:', arrayPerson)
        if(arrayPerson.person) {
            setViewPersonData(arrayPerson.person)
        } else if(arrayPerson.member) {
            setViewPersonData(arrayPerson.member.application.person)
        } else {
            setViewPersonData(arrayPerson)
        }
    }, [arrayPerson])

    const handleToggle = () => {
        setShowContact(!showContact)
    }

    return (
        <>
            <div className="card my-3 border shadow">
                <div className="card-header"  style={{ background: '#a6a9b1'}} >
                    <div className="d-flex">
                        <PersonFill size={28} className='text-primary me-2' />
                        <h4 className="text-primary"><strong>{ title }</strong></h4>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    <div className="container px-1 px-sm-3">
                        <div className="form-group row mb-3">
                            <div className="d-flex">
                                <FilePerson size={28} />
                                <span className="h5 ms-2">{viewPersonData.lastName}, {viewPersonData.firstName} {viewPersonData.middleName}</span>
                            </div>
                        </div>
                        <div className="form-group row row-cols-auto">
                            <div className="col-6 col-xxl-3">
                                <div className="form-floating mb-3">
                                    <input 
                                        id="dob"
                                        type="text" 
                                        className="form-control"
                                        value={viewPersonData.dob}
                                        disabled
                                        readOnly
                                    />
                                    <label htmlFor="dob">Date Of Birth</label>
                                </div>
                            </div>
                            <div className="col-6 col-xxl-3">
                                <div className="form-floating mb-3">
                                    <input 
                                        id="lifeStatus"
                                        type="text" 
                                        className="form-control"
                                        value={viewPersonData.lifeStatus}
                                        disabled
                                        readOnly
                                    />
                                    <label htmlFor="lifeStatus">Life Status</label>
                                </div>
                            </div>
                            <div className="col-6 col-xxl-3">
                                <div className="form-floating mb-3">
                                    <input 
                                        id="createdAt"
                                        type="text" 
                                        className="form-control"
                                        value={viewPersonData.createdAt}
                                        disabled
                                        readOnly
                                    />
                                    <label htmlFor="createdAt">Created At</label>
                                </div>
                            </div>
                            <div className="col-6 col-xxl-3">
                                <div className="form-floating mb-3">
                                    <input 
                                        id="updatedAt"
                                        type="text" 
                                        className="form-control"
                                        value={viewPersonData.updatedAt}
                                        disabled
                                        readOnly
                                    />
                                    <label htmlFor="updatedAt">Updated At</label>
                                </div>
                            </div>
                        </div>

                        {arrayPerson.maritalStatus && (
                            <div className="form-group row row-cols-auto">
                                <div className="col-6 col-xxl-3">
                                    <div className="form-floating mb-3">
                                        <input 
                                            id="maritalStatus"
                                            type="text" 
                                            className="form-control"
                                            value={arrayPerson.maritalStatus}
                                            disabled
                                            readOnly
                                        />
                                        <label htmlFor="dob">Sibling Type</label>
                                    </div>
                                </div>
                            </div>
                        ) }

                        {arrayPerson.siblingType && (
                            <div className="form-group row row-cols-auto">
                                <div className="col-6 col-xxl-3">
                                    <div className="form-floating mb-3">
                                        <input 
                                            id="siblingType"
                                            type="text" 
                                            className="form-control"
                                            value={arrayPerson.siblingType}
                                            disabled
                                            readOnly
                                        />
                                        <label htmlFor="dob">Sibling Type</label>
                                    </div>
                                </div>
                            </div>
                        ) }

                        {arrayPerson.relationship && (
                            <div className="form-group row row-cols-auto">
                                <div className="col-6 col-xxl-3">
                                    <div className="form-floating mb-3">
                                        <input 
                                            id="relationship"
                                            type="text" 
                                            className="form-control"
                                            value={arrayPerson.relationship}
                                            disabled
                                            readOnly
                                        />
                                        <label htmlFor="dob">Relationship</label>
                                    </div>
                                </div>
                            </div>
                        ) }

                        {arrayPerson.percentage && (
                            <div className="form-group row row-cols-auto">
                                <div className="col-6 col-xxl-3">
                                    <div className="form-floating mb-3">
                                        <input 
                                            id="percentage"
                                            type="text" 
                                            className="form-control"
                                            value={`${arrayPerson.percentage} %`}
                                            disabled
                                            readOnly
                                        />
                                        <label htmlFor="dob">Percentage</label>
                                    </div>
                                </div>
                            </div>
                        ) }

                        <div className="d-flex mb-3 justify-content-end">
                            <button onClick={handleToggle} className="btn btn-dark">
                                {showContact ? 'Hide Contact' : 'Show Contact'}
                            </button>
                        </div>
                        {
                            showContact && (
                                <ViewContactCard contact={viewPersonData.contact} />
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </>
    )
}

ViewPersonCard.propTypes = {
    arrayPerson: PropTypes.object,
    title: PropTypes.string,
}

export default ViewPersonCard

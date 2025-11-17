import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const DEFAULT_ARRAY_PERSON = {
    person: {
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
    },
}

const SummaryPersonCard = (props) => {
    const { index, arrayPerson } = props
    const [viewArrayPerson, setViewArrayPerson] = useState(DEFAULT_ARRAY_PERSON)

    useEffect(() => {
        if(arrayPerson.person) {
            setViewArrayPerson(arrayPerson)
        } else if(arrayPerson.member) { // For person => referee
            setViewArrayPerson(arrayPerson.member.application)
        }
    }, [arrayPerson])

    return (
        <>
            <div className="border py-3">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">{index + 1}. {viewArrayPerson.person.lastName}, {viewArrayPerson.person.firstName} {viewArrayPerson.person.middleName}</div>
                        <div className="d-flex row row-cols-auto">
                            <div className="col">
                                <span className='small fw-bold text-primary'>Date Of Birth:</span> {viewArrayPerson.person.dob}
                            </div>
                            <div className="col">
                                <span className='small fw-bold text-primary'>Life Status:</span> {viewArrayPerson.person.lifeStatus}
                            </div>
                            <div className="col">
                                <span className='small fw-bold text-primary'>Created At:</span> {viewArrayPerson.person.createdAt}
                            </div>
                            <div className="col">
                                <span className='small fw-bold text-primary'>Updated At:</span> {viewArrayPerson.person.updatedAt}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

SummaryPersonCard.propTypes = {
    index: PropTypes.number,
    arrayPerson: PropTypes.object,
}

export default SummaryPersonCard

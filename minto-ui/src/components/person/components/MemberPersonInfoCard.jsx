import { useState } from "react"
import ViewPersonCard from "./ViewPersonCard"
import PropTypes from 'prop-types'
import { CaretDownFill, CaretUpFill } from "react-bootstrap-icons"
import SummaryPersonCard from "./SummaryPersonCard"

const MemberPersonInfoCard = (props) => {
    const { peopleData, headerIcon, bodyIcon, headerTitle, personTypeSingle, personTypeMultiple, priColor } = props
    const [isOpen, setIsOpen] = useState(false)
    const HeaderIconComponent = headerIcon
    const BodyIconComponent = bodyIcon

    return (
        <>
            <div className='card px-0 mb-3'>
                <div className="card-header text-white" style={{ backgroundColor: priColor }}>
                    <div className="d-flex">
                        <HeaderIconComponent size={28} className='me-2 text-white' />
                        <h3 className='text-bold text-white'>{ headerTitle }</h3>
                        <button type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="btn text-white ms-auto"
                        >
                            { 
                                isOpen ? 
                                <span><CaretUpFill size={22} className="me-1" />Show Less</span> : 
                                <span><CaretDownFill size={22} className="me-1" />Show More</span>
                            }
                        </button>
                    </div>
                </div>
                <div className="card-body px-1 px-sm-3">
                    { isOpen ? (
                        <div className="container py-6 px-1 px-sm-6 mb-4 rounded-lg border">
                            <div className="d-flex justify-content-between p-2 mt-2 mb-4">
                                <div className="d-flex items-center">
                                    <BodyIconComponent size={32} className='mt-1 mx-1' style={{ color: priColor }} />
                                    <h3 
                                        className="text-lg font-semibold"
                                        style={{ color: priColor }}
                                    >
                                        <strong>{ personTypeMultiple }</strong>
                                    </h3>
                                </div>
                            </div>
                        
                            {peopleData.length === 0 ? (
                                <p className="text-secondary text-center py-4">No { personTypeMultiple.toLowerCase() } added yet</p>
                            ) : (
                                peopleData.map((personData, index) => 
                                    <ViewPersonCard key={index} arrayPerson={personData} title={`${personTypeSingle} ${index + 1} Details`} />
                                )
                            )}
                        </div>
                    ) : (
                        <>
                            {peopleData.length === 0 ? (
                                <p className="text-secondary text-center py-4">No { personTypeMultiple.toLowerCase() } added yet</p>
                            ) : (
                                peopleData.map((personData, index) => 
                                    <SummaryPersonCard key={index} index={index} arrayPerson={personData} />
                                )
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

MemberPersonInfoCard.propTypes = {
    peopleData: PropTypes.array, 
    headerIcon: PropTypes.elementType, 
    bodyIcon: PropTypes.elementType,
    headerTitle: PropTypes.string,
    personTypeSingle: PropTypes.string,
    personTypeMultiple: PropTypes.string,
    priColor: PropTypes.string,
}

export default MemberPersonInfoCard

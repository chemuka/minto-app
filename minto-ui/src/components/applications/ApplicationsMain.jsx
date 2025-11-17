import { Suspense, useState } from "react"
import LoadingSpinner from "../loading/LoadingSpinner"
import MembershipForm from "../membership/MembershipForm"
import { ButtonGroup, ToggleButton } from "react-bootstrap"
import EditApplication from "./EditApplication"
import ReviewApplications from "./ReviewApplications"

const ApplicationsMain = () => {
    const [radioValue, setRadioValue] = useState('1')
                
    const appRadios = [
        { name: 'Search/Edit', value: '1' },
        { name: 'Add New', value: '2' },
        { name: 'Process Applications', value: '3' },
    ]

    const renderComponent = () => {
        switch(radioValue) {
            case '1':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Search/Edit Application'} clsTextColor={"text-primary"} />}>
                        <EditApplication />
                    </Suspense>
                )
            case '2':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'New Application'} clsTextColor={"text-primary"} />}>
                        <MembershipForm title={'New Membership Application'} headerBgColor={'bg-primary'} cardBorderColor={'border-primary'} />
                    </Suspense>
                )
            case '3':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Process Applications'} clsTextColor={"text-primary"} />}>
                        <ReviewApplications />
                    </Suspense>
                )
            default:
                return <div className="mt-5 text-center text-primary"><h2>Not Found</h2></div>
        }
    }

    return (
        <div className="mb-3">
            <Suspense fallback={<LoadingSpinner caption={'Applications'} clsTextColor={"text-primary"} />}>
                <div className="">
                    <h2 className="text-center text-primary mb-1">APPLICATIONS</h2>
                    <ButtonGroup className='border shadow'>
                        {appRadios.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-app-${idx}`}
                                type="radio"
                                variant={'outline-primary'}
                                name={`radio-app-${idx}`}
                                value={radio.value}
                                checked={radioValue === radio.value}
                                onChange={(e) => setRadioValue(e.currentTarget.value)}
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                    {renderComponent()}
                </div>
            </Suspense>
        </div>
    )
}

export default ApplicationsMain

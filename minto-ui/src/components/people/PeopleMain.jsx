import { Suspense, useState } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import ViewAllPeople from "./ViewAllPeople";
import CreatePerson from "./components/CreatePerson";
import EditPerson from "./components/EditPerson";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

const PeopleMain = () => {
    const [radioValue, setRadioValue] = useState('1');
        
    const personRadios = [
        { name: 'Search/Edit', value: '1' },
        { name: 'Create', value: '2' },
        { name: 'List All People', value: '3' },
    ]

    const renderComponent = () => {
        switch(radioValue) {
            case '1':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Search/Edit Person'} clsTextColor={"text-info"} />}>
                        <EditPerson />
                    </Suspense>
                )
            case '2':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Create Person'} clsTextColor={"text-info"} />}>
                        <CreatePerson />
                    </Suspense>
                )
            case '3':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'All People'} clsTextColor={"text-info"} />}>
                        <ViewAllPeople />
                    </Suspense>
                )
            default:
                return <div className="mt-5 text-center text-info"><h2>Not Found</h2></div>
        }
    }

    return (
        <div className="mb-3">
            <Suspense fallback={<LoadingSpinner caption={'People'} clsTextColor={"text-primary"} />}>
                <div className="">
                    <h2 className="text-center text-info mb-2">PEOPLE</h2>
                    <ButtonGroup className='border shadow'>
                        {personRadios.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-pple-${idx}`}
                                type="radio"
                                variant={'outline-info'}
                                name={`radio-pple-${idx}`}
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

export default PeopleMain
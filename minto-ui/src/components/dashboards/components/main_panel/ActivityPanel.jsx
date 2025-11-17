import { Suspense } from "react";
import LoadingSpinner from "../../../loading/LoadingSpinner";
import UserPanel from "./UsersPanel";
import MembersPanel from "./MembersPanel";
import PaymentsPanel from "./PaymentsPanel";
import PropTypes from 'prop-types';
import UnderConstruction from "../../../misc/under_construction/UnderConstruction";
import HomePanel from "./HomePanel";
import PeoplePanel from "./PeoplePanel";
import ApplicationsPanel from "./ApplicationsPanel";

const ActivityPanel = (props) => {
    const { activePanel } = props

    const renderComponent = () => {
        switch(activePanel) {
            case 'Dashboard':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Dashboard home'} />}>
                        <HomePanel />
                    </Suspense>
                );
            case 'Users':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Users'} />}>
                        <UserPanel />
                    </Suspense>
                );
            case 'Members':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Members'} />}>
                        <MembersPanel />
                        <ApplicationsPanel />
                        <PeoplePanel />
                    </Suspense>
                );
            case 'People':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'People'} />}>
                        <PeoplePanel />
                    </Suspense>
                );
            case 'Payments':
                return (
                    <Suspense fallback={<LoadingSpinner caption={'Payments'} />}>
                        <PaymentsPanel />
                    </Suspense>
                );
            default:
                return <UnderConstruction />;
        }
    };

    return (
        <>
            <div className="d-flex flex-wrap justify-content-between mb-3">
                {renderComponent()}
            </div>
        </>
    )
}

ActivityPanel.propTypes = {
    activePanel: PropTypes.string
}

export default ActivityPanel

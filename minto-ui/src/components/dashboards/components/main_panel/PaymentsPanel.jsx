import { Suspense } from "react"
import LoadingSpinner from "../../../loading/LoadingSpinner"
import ViewAllPayments from "../../../payments/ViewAllPayments"

const PaymentsPanel = () => {
    return (
        <>
            <div className="activity-panel">
                <Suspense fallback={<LoadingSpinner caption={'View All Payments'} clsTextColor={"text-success"}/>}>
                    <ViewAllPayments />
                </Suspense>
            </div>
        </>
    )
}

export default PaymentsPanel

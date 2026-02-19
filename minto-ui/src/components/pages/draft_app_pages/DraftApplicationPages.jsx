import { Suspense } from "react"
import DraftApplication from "../../applications/draft/DraftApplication"
import LoadingSpinner from "../../loading/LoadingSpinner"

const DraftApplicationPage = () => {
    return (
        <>
            <div className="container mt-5 pt-2">
                <Suspense fallback={<LoadingSpinner caption={'Applications'} clsTextColor={"text-primary"} />}>
                    <DraftApplication title={'My Application'} headerBgColor={'bg-primary'} cardBorderColor={'border-primary'} />
                </Suspense>
            </div>
        </>
    )
}

export default DraftApplicationPage

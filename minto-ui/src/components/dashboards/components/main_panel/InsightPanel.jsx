import { CashStack, PeopleFill, PersonVcardFill } from "react-bootstrap-icons"
import Insight from "./Insight"
import { membersData, paymentsData, usersData } from "../charts/Data"

const InsightPanel = () => {
    return (
        <>
            <div className="insights">
                <Insight 
                    icon={<PeopleFill className="text-primary" size={40} />}
                    title={'Active Users'}
                    value={'724'}
                    percentage={'81%'}
                    duration={'Last 30 Days'}
                    data={usersData}
                />

                <Insight 
                    icon={<PersonVcardFill className="text-danger" size={40} />}
                    title={'Members'}
                    value={'1,260'}
                    percentage={'62%'}
                    duration={'Last 30 Days'}
                    data={membersData}
                />
                
                <Insight 
                    icon={<CashStack className="text-success" size={40} />}
                    title={'Payments'}
                    value={'$31,864'}
                    percentage={'44%'}
                    duration={'Last 30 Days'}
                    data={paymentsData}
                />
            </div>
        </>
    )
}

export default InsightPanel

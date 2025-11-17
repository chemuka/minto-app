import { Cart3, PersonFill, Plus, Shop } from "react-bootstrap-icons"

const AnalyticsPanel = () => {
    return (
        <>
            <div className="payments-analytics">
                <h2>Payments Analytics</h2>
                <div className="item online">
                    <div className="icon">
                        <Cart3 size={24} />
                    </div>
                    <div className="right">
                        <div className="info">
                            <h3>ONLINE PAYMENTS</h3>
                            <small className="text-muted">Last 30 Days</small>
                        </div>
                        <h5 className="text-success me-1">+39%</h5>
                        <h3 className="ms-1">3849</h3>
                    </div>
                </div>
                <div className="item offline">
                    <div className="icon">
                        <Shop size={24} />
                    </div>
                    <div className="right">
                        <div className="info">
                            <h3>OFFLINE PAYMENTS</h3>
                            <small className="text-muted">Last 30 Days</small>
                        </div>
                        <h5 className="text-danger me-1">-17%</h5>
                        <h3 className="ms-1">1100</h3>
                    </div>
                </div>
                <div className="item customers">
                    <div className="icon">
                        <PersonFill size={24} />
                    </div>
                    <div className="right">
                        <div className="info">
                            <h3>NEW MEMBERS</h3>
                            <small className="text-muted">Last 30 Days</small>
                        </div>
                        <h5 className="text-success me-1">+25%</h5>
                        <h3 className="ms-1">12</h3>
                    </div>
                </div>
                <div className="item add-payment">
                    <div>
                        <Plus size={24} />
                        <h3 className="mb-0">Add Payment</h3>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AnalyticsPanel

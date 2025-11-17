import InsightDoughnut from "../charts/InsightDoughnut";
import PropTypes from 'prop-types';

const options = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    cutoutPercentage: 90,
    plugins: {
        legend: {
        display: false,
        },
    },
};

const Insight = (props) => {
    const { icon, title, value, percentage, duration, data } = props

    return (
        <>
            <div className="users">
                {icon}
                <div className="middle">
                    <div className="left">
                        <h3>{title}</h3>
                        <h1>{value}</h1>
                    </div>
                    <div style={{width: '6rem', height: '6rem', position: 'relative', marginBottom: '1%', padding: '1%'}}> 
                        <InsightDoughnut data={data} options={options} />
                        <p><b>{percentage}</b></p>
                    </div>
                </div>
                <small className="text-muted">{duration}</small>
            </div>
        </>
    )
}

Insight.propTypes = {
    icon: PropTypes.element,
    title: PropTypes.string,
    value: PropTypes.string,
    percentage: PropTypes.string,
    duration: PropTypes.string,
    data: PropTypes.object
}

export default Insight

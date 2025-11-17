import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend);

const InsightDoughnut = (props) => {
    const { data, options } = props

    return <Doughnut data={data} options={options} />;
}

InsightDoughnut.propTypes = {
    data: PropTypes.object,
    options: PropTypes.object
}

export default InsightDoughnut

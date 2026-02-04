import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsPieChart = ({ completed, inProgress, notStarted }) => {
    const data = {
        labels: ['Completed', 'Available', 'Not Started'],
        datasets: [
            {
                data: [completed, inProgress, notStarted],
                backgroundColor: [
                    '#4CAF50', // Green
                    '#FFC107', // Amber
                    '#E0E0E0', // Grey
                ],
                borderColor: [
                    '#388E3C',
                    '#FFA000',
                    '#BDBDBD',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Overall Content Status',
                font: {
                    size: 16
                }
            }
        },
    };

    return <div style={{ maxWidth: '300px', margin: '0 auto' }}><Pie data={data} options={options} /></div>;
};

export default AnalyticsPieChart;

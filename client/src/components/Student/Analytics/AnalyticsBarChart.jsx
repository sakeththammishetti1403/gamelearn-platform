import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsBarChart = ({ subjects }) => {
    const data = {
        labels: subjects.map(s => s.title),
        datasets: [
            {
                label: 'Progress (%)',
                data: subjects.map(s => s.overallProgress),
                backgroundColor: '#4F7DF3',
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Subject-wise Completion',
                font: {
                    size: 16
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    return <div style={{ width: '100%', height: '300px' }}><Bar data={data} options={options} /></div>;
};

export default AnalyticsBarChart;

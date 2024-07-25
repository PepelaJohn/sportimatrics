import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FC } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    data: {
        labels: string[];
        values: number[];
    };
}

const BarChart: FC<BarChartProps> = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Total Minutes Played',
                data: data.values,
                backgroundColor: 'rgba(39, 83, 52, 0.6)', // Adjust for dark mode
                borderColor: '#0f2711f0',
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio:true,
        plugins: {
            legend: {
               
                labels: {
                    color: '#a3a3a3',
                    display:'none',
                    opacity:0 // Text color for legend
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.dataset.label}: ${context.raw} minutes`
                },
                backgroundColor: '#000000', // Tooltip background color
                titleColor: '#888888', // Tooltip title color
                bodyColor: '#7c7c7c', // Tooltip body color
                borderColor:"#091408"
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: '#6e6d6d' ,
                    fontSize:5// X-axis labels color
                },
                grid: {
                    color: '#2e2e2e' // X-axis grid lines color
                }
            },
            y: {
                ticks: {
                    color: '#fff' // Y-axis labels color
                },
                grid: {
                    color: '#2e2e2e' // Y-axis grid lines color
                }
            }
        },
        backgroundColor: '#333' // Chart background color
    };

    return <Bar data={chartData} options={options} className='w-fit h-auto' />;
};

export default BarChart;

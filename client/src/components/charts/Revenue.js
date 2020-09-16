import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const Revenue = ({ labelsData, revenuesData, cashsData, debtsData }) => {
    const [char, setChar] = useState({
        labels : '',
        revenues: '',
        cashs: '',
        debts: '',
    });

    const { labels, revenues, cashs, debts } = char;

    const charData = {
        labels: labels,
        datasets: [
            {
                label: "Omzet",
                backgroundColor: '#99d8d0',
                borderColor: '#99d8d0',
                fill: false,
                data: revenues
            },
            {
                label: "Tunai",
                backgroundColor: '#fecb89',
                borderColor: '#fecb89',
                fill: false,
                data: cashs
            },
            {
                label: "Angsur",
                backgroundColor: '#ffbcbc',
                borderColor: '#ffbcbc',
                fill: false,
                data: debts
            }
        ]
    }

    useEffect(() => {
        setChar({
            'labels':labelsData, 
            'revenues':revenuesData, 
            'cashs': cashsData, 
            'debts': debtsData
        });
    }, [labelsData, revenuesData, cashsData, debtsData]);

    return (
        <div className="chart">
            <Line 
                data = {charData}
                height={200}
                options = {{
                    maintainAspectRatio: false,
                    legend: {
						position: 'top',
					},
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0,
                                stepSize: 5
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Rp (juta)'
                            }
                        }]
                    }
                }}
            />
        </div>
    );
};

export default Revenue;
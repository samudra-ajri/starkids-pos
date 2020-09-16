import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

const TopItems = ({ itemsData }) => {
    const [char, setChar] = useState({
        labels : [],
        topItems: [],
    });
    
    const { labels, topItems } = char;

    const charData = {
        labels: labels,
        datasets: [
            {
                label: "Omzet",
                backgroundColor: ['#e8505b', '#e36387', '#f2aaaa', '#f37121', '#ffbd69', '#f9d56e', '#f3ecc2', '#14b1ab', '#a6dcef', '#ddf3f5'],
                data: topItems
            }
        ]
    }

    useEffect(() => {
        setChar({
            'labels':itemsData.map(a => a.name), 
            'topItems':itemsData.map(a => a.value)
        });
    }, [itemsData]);

    return (
        <div className="chart">
            <Doughnut 
                data = {charData}
                height={80}
                options = {{
                    responsive: true,
                    legend: {
						position: 'right',
					}
                }}
            />
        </div>
    );
};

export default TopItems;
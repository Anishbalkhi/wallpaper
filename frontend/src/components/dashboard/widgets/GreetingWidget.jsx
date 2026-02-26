import React from 'react';

const GreetingWidget = ({ name }) => {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';

    return (
        <div className="flex items-center justify-between mb-2">
            <div>
                <h1 className="text-4xl font-light text-gray-400">
                    {greeting}, <span className="font-semibold text-gray-900">{name}</span>
                </h1>
            </div>
        </div>
    );
};

export default GreetingWidget;

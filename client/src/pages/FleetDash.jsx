import React from 'react';
import NavBar from '../components/NavBar';
import Filter from '../components/fleetdash components/Filter';
import ScoreCard from '../components/ScoreCard';

function FleetDash() {

    const drivers = [
        { name: "Jane Doe", phone: "+1 (123) 123-1234", score: 50, change: "-3.2%" },
        { name: "John Doe", phone: "+1 (123) 313-3227", score: 67, change: "-1.8%" },
        { name: "Alice Smith", phone: "+1 (123) 987-6543", score: 45, change: "-2.5%" },
        { name: "Bob Johnson", phone: "+1 (123) 111-2222", score: 52, change: "+1.4%" },
        { name: "Charlie Brown", phone: "+1 (123) 555-6666", score: 38, change: "-4.1%" },
    ];

    return (
        <div className="flex min-h-screen ">
            <div className="w-full">
                <div className="grid grid-cols-12 auto-rows-min">
                    <div className="col-span-12">
                        <NavBar />
                    </div>
                    <div className="col-span-12">
                        {/* Filter - WIP */}
                        <Filter />
                    </div>
                    <div className="col-span-12">
                        {/* Driver cards in rows */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ">
                            {drivers.map((driver) => (
                                <ScoreCard
                                    key={driver.name}
                                    name={driver.name}
                                    phone={driver.phone}
                                    score={driver.score}
                                    change={driver.change}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FleetDash;

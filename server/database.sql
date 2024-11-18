CREATE TABLE dispatchers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE fleets (
    id SERIAL PRIMARY KEY,
    organization_name VARCHAR(150) NOT NULL,
    vehicle_count INTEGER DEFAULT 0,
    risk_score INTEGER DEFAULT 0,
    dispatcher_id INTEGER UNIQUE,
    FOREIGN KEY (dispatcher_id) REFERENCES dispatchers(id) ON DELETE SET NULL
);

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    driver_name VARCHAR(100) NOT NULL,
    driver_phone_number VARCHAR(15) UNIQUE NOT NULL,
    risk_score INTEGER DEFAULT 0,
    fleet_id INTEGER NOT NULL,
    FOREIGN KEY (fleet_id) REFERENCES fleets(id) ON DELETE CASCADE
);

CREATE TABLE risk_events ( 
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    drinking BOOLEAN DEFAULT false,
    eating BOOLEAN DEFAULT false,
    hands_off_wheel INTEGER DEFAULT 0,
    hands_on_wheel INTEGER DEFAULT 0,
    phone BOOLEAN DEFAULT false,
    seatbelt_on BOOLEAN DEFAULT false,
    sleeping BOOLEAN DEFAULT false,
    smoking BOOLEAN DEFAULT false,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);
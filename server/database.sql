create table dispatcher (
    id serial primary key,
    name varchar(100) not null,
    phone_number varchar(15) unique not null,
    password varchar(255) not null
);

create table fleet (
    id serial primary key,
    organization_name varchar(150) not null,
    dispatcher_id integer unique,
    foreign key (dispatcher_id) references dispatcher(id) on delete set null
);

create table driver (
    id serial primary key,
    name varchar(100) not null,
    active boolean default false,
    phone_number varchar(15) unique not null,
    risk_score decimal(5,2) default 100,
    fleet_id integer not null,
    foreign key (fleet_id) references fleet(id) on delete cascade
);

create table trip (
	id serial primary key,
	risk_score decimal(5,2) default 100,
	start_time timestamp with time zone not null,
	end_time timestamp with time zone,
	driver_id integer not null,
	foreign key (driver_id) references driver(id) on delete cascade
);

create table risk_event ( 
    id serial primary key,
    trip_id integer not null,
    timestamp timestamp with time zone not null,
    drinking boolean default false,
    eating boolean default false,
    phone boolean default false,
    seatbelt_off boolean default false,
    sleeping boolean default false,
    smoking boolean default false,
    out_of_lane boolean default false,
    risky_drivers integer default 0,
    unsafe_distance boolean default false,
    hands_off_wheel boolean default false,
    foreign key (trip_id) references trip(id) on delete cascade
);

create table driver_risk_history (
    id serial primary key,
    driver_id integer not null,
    risk_score decimal(5,2) not null,
    from_timestamp timestamp with time zone not null,
    to_timestamp timestamp with time zone,
    foreign key (driver_id) references driver(id) on delete cascade
);
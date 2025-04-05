-- Create table for alerts (including deforestation alerts)
create table if not exists public.alerts (
   id          uuid primary key default gen_random_uuid(),
   title       text not null,
   description text,
   alert_type  text not null,
   severity    text not null,
   lat         double precision,
   lng         double precision,
   is_read     boolean not null default false,
   created_at  timestamptz not null default now()
);

-- Create table for energy readings from different sources
create table if not exists public.energy_readings (
   id            uuid primary key default gen_random_uuid(),
   reading_type  text not null,
   reading_value double precision not null,
   timestamp     timestamptz not null default now(),
   user_id       uuid
      references public.profiles ( id ),
   created_at    timestamptz not null default now()
);

-- Create table for drone scan data
create table if not exists public.drone_scans (
   id              uuid primary key default gen_random_uuid(),
   user_id         text not null,
   mission_name    text not null,
   scan_area_name  text not null,
   lat             double precision not null,
   lng             double precision not null,
   altitude_meters double precision,
   image_url       text,
   findings        text,
   created_at      timestamptz not null default now()
);

-- Insert sample data for testing (optional)
insert into public.alerts (
   title,
   description,
   alert_type,
   severity,
   lat,
   lng
) values ( 'Deforestation Alert: Amazon Rainforest',
           'Satellite imagery has detected significant forest loss in this area over the past 7 days.',
           'deforestation',
           'high',
           - 3.4653,
           - 62.2159 ),( 'Illegal Logging Detected',
                         'AI analysis of drone footage indicates unauthorized logging activity.',
                         'deforestation',
                         'medium',
                         - 2.9876,
                         - 59.8765 ),( 'Forest Fire Risk',
                                       'Climate conditions indicate high risk of forest fires in this region.',
                                       'deforestation',
                                       'low',
                                       - 4.2583,
                                       - 69.9345 );

-- Insert sample energy readings for today
insert into public.energy_readings (
   reading_type,
   reading_value
) values ( 'solar',
           515.6 ),( 'wind',
                     400.5 ),( 'hydro',
                               665.7 ),( 'biomass',
                                         132.8 ),( 'geothermal',
                                                   93.5 );

insert into public.drone_scans (
   user_id,
   mission_name,
   scan_area_name,
   lat,
   lng,
   altitude_meters,
   findings
) values ( 'current-user-id',
           'Amazon Rainforest Survey',
           'Section A-3',
           - 3.4732,
           - 62.2245,
           120,
           'Detected 2 areas of recent tree cutting, approximately 0.5 hectares in total' ),( 'current-user-id',
                                                                                              'Borneo Patrol',
                                                                                              'Northeast Region',
                                                                                              4.2105,
                                                                                              117.5493,
                                                                                              150,
                                                                                              'No significant changes detected since last scan'
                                                                                              ),( 'current-user-id',
                                                                                                                                                'Congo Basin Monitoring'
                                                                                                                                                ,
                                                                                                                                                'Western Sector'
                                                                                                                                                ,
                                                                                                                                                - 0.8223
                                                                                                                                                ,
                                                                                                                                                16.2834
                                                                                                                                                ,
                                                                                                                                                100
                                                                                                                                                ,
                                                                                                                                                'Several new access roads detected, potential illegal logging operation'
                                                                                                                                                )
                                                                                                                                                ;
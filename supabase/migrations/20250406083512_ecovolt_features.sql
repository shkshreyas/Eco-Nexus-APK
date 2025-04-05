/*
  # EcoVolt 2.0 Features Schema

  1. New Tables
    - disaster_zones
      - Real-time disaster data for AR visualization
    - ewaste_items
      - E-waste tracking with QR codes
    - ewaste_recycling_events
      - Logging of e-waste recycling activities
    - forest_data
      - Deforestation tracking and energy impact calculation
    - drone_scans
      - Drone reconnaissance data
    - energy_readings
      - Smart meter data for energy tracking
    - alerts
      - AI-generated deforestation alerts
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create disaster_zones table
CREATE TABLE IF NOT EXISTS disaster_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  intensity FLOAT NOT NULL, -- Scale from 0.0 to 1.0
  disaster_type TEXT NOT NULL, -- flood, fire, earthquake, etc.
  radius_meters INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ewaste_items table
CREATE TABLE IF NOT EXISTS ewaste_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  item_type TEXT NOT NULL, -- electronics, batteries, etc.
  description TEXT,
  weight_kg FLOAT,
  qr_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'registered', -- registered, in_transit, recycled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ewaste_recycling_events table
CREATE TABLE IF NOT EXISTS ewaste_recycling_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES ewaste_items(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  location TEXT,
  lat FLOAT,
  lng FLOAT,
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create forest_data table
CREATE TABLE IF NOT EXISTS forest_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_name TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  area_hectares FLOAT NOT NULL,
  tree_count INTEGER,
  health FLOAT NOT NULL, -- Scale from 0.0 to 100.0
  co2_absorption FLOAT NOT NULL, -- kg per year
  deforestation_risk FLOAT, -- Scale from 0.0 to 1.0
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create drone_scans table
CREATE TABLE IF NOT EXISTS drone_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  mission_name TEXT NOT NULL,
  scan_area_name TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  altitude_meters FLOAT,
  image_url TEXT,
  findings TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create energy_readings table
CREATE TABLE IF NOT EXISTS energy_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  reading_value FLOAT NOT NULL, -- kWh
  reading_type TEXT NOT NULL, -- consumption, generation, savings
  source TEXT, -- solar, wind, grid, etc.
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL, -- deforestation, disaster, energy
  severity TEXT NOT NULL, -- low, medium, high
  title TEXT NOT NULL,
  description TEXT,
  lat FLOAT,
  lng FLOAT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE disaster_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ewaste_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ewaste_recycling_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE forest_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Disaster zones policies
CREATE POLICY "Disaster zones are viewable by everyone"
  ON disaster_zones FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create disaster zones"
  ON disaster_zones FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- E-waste items policies
CREATE POLICY "E-waste items are viewable by everyone"
  ON ewaste_items FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create e-waste items"
  ON ewaste_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own e-waste items"
  ON ewaste_items FOR UPDATE
  USING (auth.uid() = user_id);

-- E-waste recycling events policies
CREATE POLICY "E-waste recycling events are viewable by everyone"
  ON ewaste_recycling_events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create recycling events"
  ON ewaste_recycling_events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Forest data policies
CREATE POLICY "Forest data is viewable by everyone"
  ON forest_data FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forest data"
  ON forest_data FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Drone scans policies
CREATE POLICY "Drone scans are viewable by everyone"
  ON drone_scans FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create drone scans"
  ON drone_scans FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own drone scans"
  ON drone_scans FOR UPDATE
  USING (auth.uid() = user_id);

-- Energy readings policies
CREATE POLICY "Energy readings are viewable by everyone"
  ON energy_readings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create energy readings"
  ON energy_readings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own energy readings"
  ON energy_readings FOR UPDATE
  USING (auth.uid() = user_id);

-- Alerts policies
CREATE POLICY "Alerts are viewable by everyone"
  ON alerts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create alerts"
  ON alerts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create functions
CREATE OR REPLACE FUNCTION log_recycle(
  item_id UUID,
  user_id UUID
) RETURNS void AS $$
BEGIN
  -- Update the e-waste item status
  UPDATE ewaste_items
  SET status = 'recycled'
  WHERE id = item_id;
  
  -- Create a recycling event
  INSERT INTO ewaste_recycling_events (item_id, user_id, points_awarded)
  VALUES (item_id, user_id, 50);
  
  -- Award green points to the user
  UPDATE profiles
  SET green_points = green_points + 50
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
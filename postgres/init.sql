\c chess_club

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE contact_type AS ENUM('Landline', 'Mobile');
CREATE TYPE gender_type AS ENUM('Male', 'Female', 'Other');

CREATE TABLE IF NOT EXISTS clubs (
       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       name VARCHAR(60) NOT NULL,
       address VARCHAR(40) NOT NULL,
       email VARCHAR(255) NOT NULL,
       description VARCHAR(1000),
       social_networks jsonb DEFAULT '{"facebook": null, "twitter": null, "instagram": null}'
);

CREATE TABLE IF NOT EXISTS club_contacts (
       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       phone_number VARCHAR(25) NOT NULL,
       contact_type contact_type NOT NULL,
       club_id UUID REFERENCES clubs(id)
);

CREATE TABLE IF NOT EXISTS members (
       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       firstname VARCHAR(60) NOT NULL,
       lastname VARCHAR(60) NOT NULL,
       age INTEGER NOT NULL,
       gender gender_type NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       is_active BOOLEAN NOT NULL DEFAULT true,
       fide_rating INTEGER,
       overdue_subscription BOOLEAN NOT NULL DEFAULT false,
       profile_photo_url VARCHAR(1000),
       lichess_profile VARCHAR(50),
       chesscom_profile VARCHAR(50),
       fide_profile VARCHAR(50),
       joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS member_contacts (
       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       phone_number VARCHAR(25) NOT NULL,
       contact_type contact_type NOT NULL,
       member_id UUID REFERENCES members(id)
);

CREATE TABLE IF NOT EXISTS club_admins (
       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       firstname VARCHAR(60) NOT NULL,
       lastname VARCHAR(60) NOT NULL,
       email VARCHAR(255) NOT NULL,
       username VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS club_admin_contacts (
       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       phone_number VARCHAR(25) NOT NULL,
       contact_type contact_type NOT NULL,
       admin_id UUID REFERENCES club_admins(id)
);

-- Default data

INSERT INTO clubs (id, name, address, email) VALUES ('d0334c59-2ecd-47a1-b6ec-790da922f623', 'my-chess-club', 'My-address', 'my-chess-club@test.com');

INSERT INTO club_admins (firstname, lastname, email, username, password) VALUES ('testName', 'testLast', 'test@example.com', 'admin', crypt('admin', gen_salt('bf')));

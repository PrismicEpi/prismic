DROP TABLE IF EXISTS "ExperimentModel" CASCADE;
-- -- DROP TABLE IF EXISTS "Breach" CASCADE;
-- -- DROP TABLE IF EXISTS "Client" CASCADE;
-- -- DROP TABLE IF EXISTS "Command" CASCADE;
-- -- DROP TABLE IF EXISTS "Host" CASCADE;
-- -- DROP TABLE IF EXISTS "KeyStroke" CASCADE;
-- -- DROP TABLE IF EXISTS "Keylog" CASCADE;

CREATE TABLE "ExperimentModel" (
    "user_email" TEXT NOT NULL,
    "experiment_id" TEXT NOT NULL,
    "input_txt" TEXT NOT NULL,
    "result_txt" TEXT,
    "experiment_date_start" TIMESTAMP NOT NULL,
    "experiment_date_end" TIMESTAMP,
    "laser_power" INT,
    "frequency" FLOAT,
    "voltage_tension" INT,
    "humidity" FLOAT,
    "temperature" FLOAT,
    "report" TEXT,
    "graph_history" FLOAT[][],
    "success_rate" FLOAT,
    "status" TEXT,
    PRIMARY KEY ("experiment_id")
);

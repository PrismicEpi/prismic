DROP TABLE IF EXISTS "ExperimentModel" CASCADE;

CREATE TABLE "ExperimentModel" (
    "user_email" TEXT NOT NULL,
    "experiment_id" TEXT NOT NULL,
    "input_txt" TEXT NOT NULL,
    "result_txt" TEXT,
    "experiment_date_start" TIMESTAMP NOT NULL,
    "experiment_date_end" TIMESTAMP,
    "laser_power" INT,
    "frequency" FLOAT,
    "voltage_tension" FLOAT,
    "humidity" FLOAT,
    "temperature" FLOAT,
    "report" BYTEA,
    "report_type" TEXT,
    "graph_history" FLOAT[][],
    "success_rate" FLOAT,
    "status" TEXT,
    "duration_sec" INT,
    PRIMARY KEY ("experiment_id")
);

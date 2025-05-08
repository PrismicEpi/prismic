import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const ExperimentModel = sequelize.define('ExperimentModel', {
    experiment_id: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    user_email: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    input_txt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    result_txt: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    experiment_date_start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    experiment_date_end: {
        type: DataTypes.DATE,
        allowNull: true
    },
    laser_power: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    frequency: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    voltage_tension: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    humidity: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    duration_sec: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    report: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    graph_history: {
        type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.FLOAT)),
        allowNull: true
    },
    success_rate: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'ExperimentModel',
    timestamps: false
});

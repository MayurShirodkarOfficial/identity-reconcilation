"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const fs_1 = __importDefault(require("fs"));
const requestLogger = (req, res, next) => {
    // Log request details to a flat file
    const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`;
    fs_1.default.appendFile('logs.txt', logMessage + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
    next();
};
exports.requestLogger = requestLogger;

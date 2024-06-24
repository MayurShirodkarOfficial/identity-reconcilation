"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeORMConfig_1 = require("./config/typeORMConfig");
const logger_middleware_1 = require("./middlewares/logger.middleware");
const identifyRouter_1 = __importDefault(require("./routes/identifyRouter"));
const app = (0, express_1.default)();
//db connection
typeORMConfig_1.DataSourceConfig.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connected To DB!");
}))
    .catch((error) => console.log(error));
// Add CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
// Logging middleware
app.use(logger_middleware_1.requestLogger);
app.use(express_1.default.json());
//routes
app.use('/identify', identifyRouter_1.default);
exports.default = app;

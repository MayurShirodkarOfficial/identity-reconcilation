"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const identify_controller_1 = require("../controllers/identify.controller");
const identifyRouter = (0, express_1.Router)();
identifyRouter.post('/', identify_controller_1.identifyContactController);
exports.default = identifyRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const planRoutes_1 = __importDefault(require("./routes/planRoutes"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express_1.default.json({ limit: '1mb' }));
app.use('/api', planRoutes_1.default);
app.use((err, _req, res, _next) => {
    console.error('[unhandled]', err);
    res.status(500).json({ message: err.message });
});
app.listen(config_1.config.port, () => {
    console.log(`Backend listening on port ${config_1.config.port}`);
});

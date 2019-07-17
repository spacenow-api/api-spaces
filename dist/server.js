"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const App_1 = __importDefault(require("./App"));
const health_controller_1 = __importDefault(require("./controllers/health/health.controller"));
const listing_controller_1 = __importDefault(require("./controllers/listing/listing.controller"));
const listingSettings_controller_1 = __importDefault(require("./controllers/listing/listingSettings.controller"));
const listingAmenities_controller_1 = __importDefault(require("./controllers/listing/listingAmenities.controller"));
const listingRules_controller_1 = __importDefault(require("./controllers/listing/listingRules.controller"));
const listingAccessDays_controller_1 = __importDefault(require("./controllers/listing/listingAccessDays.controller"));
const app = new App_1.default([
    new health_controller_1.default(),
    new listing_controller_1.default(),
    new listingSettings_controller_1.default(),
    new listingAmenities_controller_1.default(),
    new listingRules_controller_1.default(),
    new listingAccessDays_controller_1.default()
], config_1.PORT, "0.0.0.0");
app.listen();

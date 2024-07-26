import { WirelessModule } from "./WirelessModule";
import { ReadsHumidity } from "./capabilities/Humidity";
import { ReadsTemperature } from "./capabilities/Temperature";

export interface OutdoorModule extends WirelessModule, ReadsTemperature, ReadsHumidity {}
import { WirelessModule } from "./WirelessModule";
import { ReadsRain } from "./capabilities/Rain";

export interface RainModule extends WirelessModule, ReadsRain {}
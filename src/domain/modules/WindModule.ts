import { WirelessModule } from "./WirelessModule";
import { ReadsWind } from "./capabilities/Wind";

export interface WindModule extends WirelessModule, ReadsWind {}
import { BaseModule } from "./BaseModule";
import { IsWireless } from "./capabilities/Wireless";

export interface WirelessModule extends BaseModule, IsWireless {}
import { ReadsCO2 } from './capabilities/Co2';
import { ReadsHumidity } from './capabilities/Humidity';
import { ReadsTemperature } from './capabilities/Temperature';
import { WirelessModule } from './WirelessModule';

export interface IndoorModule extends WirelessModule, ReadsTemperature, ReadsCO2, ReadsHumidity {}
import { Place } from "../Place";
import { BaseModule } from "./BaseModule";
import { ReadsCO2 } from "./capabilities/Co2";
import { ReadsHumidity } from "./capabilities/Humidity";
import { ReadsNoise } from "./capabilities/Noise";
import { ReadsPressure } from "./capabilities/Pressure";
import { ReadsTemperature } from "./capabilities/Temperature";

export interface MainModule extends BaseModule, ReadsTemperature, ReadsCO2, ReadsHumidity, ReadsNoise, ReadsPressure {
    stationName: string;
    firmware: number;
    reachable: boolean;
    lastSetup: Date;
    dateSetup: Date;
    lastStatusUpdate: Date;
    lastUpgrade: Date;
    wifiStatus: number;
    co2Calibrating: boolean;
    place: Place;
    readOnly: boolean;
    measureTime: Date;
    modules: BaseModule[];
  }
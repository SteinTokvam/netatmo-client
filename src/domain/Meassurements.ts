import { MeasurementTypes } from "./MeasurementTypes.enum";

export type MeasurementType =
  MeasurementTypes.Temperature |
  MeasurementTypes.MinTemperature |
  MeasurementTypes.MaxTemperature |
  MeasurementTypes.DateMinTemperature |
  MeasurementTypes.DateMaxTemperature |
  MeasurementTypes.Humidity |
  MeasurementTypes.MinHumidity |
  MeasurementTypes.MaxHumidity |
  MeasurementTypes.DateMinHumidity |
  MeasurementTypes.DateMaxHumidity |
  MeasurementTypes.Co2 |
  MeasurementTypes.MinCo2 |
  MeasurementTypes.MaxCo2 |
  MeasurementTypes.DateMinCo2 |
  MeasurementTypes.DateMaxCo2 |
  MeasurementTypes.Pressure |
  MeasurementTypes.MinPressure |
  MeasurementTypes.MaxPressure |
  MeasurementTypes.DateMinPressure |
  MeasurementTypes.DateMaxPressure |
  MeasurementTypes.Noise |
  MeasurementTypes.MinNoise |
  MeasurementTypes.MaxNoise |
  MeasurementTypes.DateMinNoise |
  MeasurementTypes.DateMaxNoise |
  MeasurementTypes.Rain |
  MeasurementTypes.MinRain |
  MeasurementTypes.MaxRain |
  MeasurementTypes.SumRain |
  MeasurementTypes.DateMinRain |
  MeasurementTypes.DateMaxRain |
  MeasurementTypes.WindStrength |
  MeasurementTypes.WindAngle |
  MeasurementTypes.GustStrength |
  MeasurementTypes.GustAngle |
  MeasurementTypes.DateMinGust |
  MeasurementTypes.DateMaxGust;

export type Measurement = { [type in MeasurementType]?: number | null };
export type Measurements = { [timestamp: string]: Measurement };
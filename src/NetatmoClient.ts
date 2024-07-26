import axios, { AxiosError, AxiosInstance } from 'axios';
import { GetMeasureResponse } from './dto/GetMeasureResponse';
import { GetStationDataResponse } from './dto/GetStationResponse';
import { OauthScope } from './dto/OauthScope';
import { BaseModule, Measurements } from './domain';
import { StationData } from './domain/StationData';
import { MeasurementsMapper } from './MeasurementMapper';
import { StationDataMapper } from './StationDataMapper';
import { TokenResponse } from './dto/TokenResponse';
import { DefaultLogger, Logger } from './Logger';

export class NetatmoApiClient {
  private static readonly NETATMO_BASE_URL = 'https://api.netatmo.com';
  private readonly http: AxiosInstance;

  private accessToken!: string;
  private refreshToken!: string;
  private expiration!: number;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly logger: Logger = new DefaultLogger()
  ) {
    this.http = axios.create();
    this.http.interceptors.request.use((req) => {
      req.headers['Authorization'] = `Bearer ${this.accessToken}`;
      return req;
    });
  }

  public async login(//TODO: må skrives om til en oauth flow
    username: string,
    password: string,
    scopes: OauthScope[] = [OauthScope.READ_STATION]
  ): Promise<void> {
    this.logger.log('Logging in...');

    const payload = {
      /* eslint-disable @typescript-eslint/camelcase */
      grant_type: 'password',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      /* eslint-enable @typescript-eslint/camelcase */
      username: username,
      password: password,
      scope: scopes.join(' '),
    };

    const res = await this.http.post<TokenResponse>(
      `${NetatmoApiClient.NETATMO_BASE_URL}/oauth2/token`,
      new URLSearchParams(payload),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    this.saveTokens(res.data);
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiration = Date.now() + 60 * 1000;
  }

  private async refreshTokens(): Promise<void> {
    if (Date.now() > this.expiration - 60 * 1000) {
      this.logger.log('Refreshing token...');
      const payload = {
        /* eslint-disable @typescript-eslint/camelcase */
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        /* eslint-enable @typescript-eslint/camelcase */
      };

      const res = await this.http.post<TokenResponse>(
        `${NetatmoApiClient.NETATMO_BASE_URL}/oauth2/token`,
        new URLSearchParams(payload),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.saveTokens(res.data);
    }
  }

  private saveTokens(res: TokenResponse): void {
    this.accessToken = res.access_token;
    this.refreshToken = res.refresh_token;
    this.expiration = Date.now() + res.expires_in * 1000;

    this.logger.log(`Got new access token expiring at ${new Date(this.expiration).toLocaleString()}`);
  }

  public async getStationData(favorites = false): Promise<StationData> {
    await this.refreshTokens();

    try {
      const res = await this.http.get<GetStationDataResponse>(
        `${NetatmoApiClient.NETATMO_BASE_URL}/api/getstationsdata`,
        {
          params: {
            get_favorites: favorites, // eslint-disable-line @typescript-eslint/camelcase
          },
        }
      );

      return StationDataMapper.dtoToDomain(res.data.body);
    } catch (e: any) {
      this.logError(e);
      throw new Error();
    }
  }

  public async getMeasure(
    stationId: string,
    module: BaseModule,
    dateBegin?: Date,
    dateEnd?: Date,
    scale = '5min',
    limit = 1024,
    realTime = true
  ): Promise<Measurements> {
    await this.refreshTokens();

    const payload = {
      /* eslint-disable @typescript-eslint/camelcase */
      device_id: stationId,
      module_id: module.id,
      scale,
      type: MeasurementsMapper.mapCapabilitiesToType(...module.capabilities),
      date_begin: dateBegin ? dateBegin.getTime() / 1000 : undefined,
      date_end: dateEnd ? dateEnd.getTime() / 1000 : undefined,
      limit,
      optimize: false,
      real_time: realTime,
      /* eslint-enable @typescript-eslint/camelcase */
    };

    try {
      const res = await this.http.get<GetMeasureResponse>(`${NetatmoApiClient.NETATMO_BASE_URL}/api/getmeasure`, {
        params: payload,
      });
      return MeasurementsMapper.dtoToDomain(res.data.body, module.capabilities);
    } catch (e: any) {
      this.logError(e);
      throw new Error();
    }
  }

  private logError(e: AxiosError): void {
    this.logger.error(e.message);
    if (e.response) {
      this.logger.error('Response: ' + JSON.stringify(e.response.data, undefined, 2));
    }
  }
}

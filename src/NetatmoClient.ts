import axios, { AxiosError, AxiosInstance } from 'axios';
import { GetMeasureResponse } from './dto/GetMeasureResponse';
import { GetStationDataResponse } from './dto/GetStationResponse';

import { MeasurementsMapper } from './MeasurementMapper';
import { StationDataMapper } from './StationDataMapper';
import { TokenResponse } from './dto/TokenResponse';
import { GrantType } from './dto/GrantType';
import { NetatmoScale } from './dto/NetatmoScale';
import { OauthScope } from './dto/OauthScope';
import { BaseModule, Measurements, StationData } from './domain';

    const NETATMO_BASE_URL = 'https://api.netatmo.com';
    const http: AxiosInstance = axios.create({
        baseURL: NETATMO_BASE_URL,
    });

    export async function retrieveTokens(code: string, redirectUri: string, scope: OauthScope, client_id: string, client_secret: string): Promise<TokenResponse> {
        console.log('Retrieving tokens...');
        const payload = {
            grant_type: GrantType.AuthorizationCode,
            client_id,
            client_secret,
            code: code,
            redirect_uri: redirectUri,
            scope: scope
        }

        const res = await http.post<TokenResponse>(
            `${NETATMO_BASE_URL}/oauth2/token`,
            new URLSearchParams(payload),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return res.data
    }

    export async function refreshTokens(client_id: string, client_secret: string, refresh_token: string): Promise<TokenResponse> {
            console.log('Refreshing token...');
            const payload = {
                /* eslint-disable @typescript-eslint/camelcase */
                grant_type: GrantType.RefreshToken,
                refresh_token,
                client_id,
                client_secret,
                /* eslint-enable @typescript-eslint/camelcase */
            };

            const res = await http.post<TokenResponse>(
                `${NETATMO_BASE_URL}/oauth2/token`,
                new URLSearchParams(payload),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            return res.data
        }
    
    export async function getStationData(favorites = false, client_id: string, client_secret: string, refresh_token: string): Promise<StationData> {
        await refreshTokens(client_id, client_secret, refresh_token);

        try {
            const res = await http.get<GetStationDataResponse>(
                `${NETATMO_BASE_URL}/api/getstationsdata`,
                {
                    params: {
                        get_favorites: favorites, // eslint-disable-line @typescript-eslint/camelcase
                    },
                }
            );

            return StationDataMapper.dtoToDomain(res.data.body);
        } catch (e: any) {
            logError(e);
            throw new Error();
        }
    }

    export async function getMeasure(
        stationId: string,
        module: BaseModule,
        client_id: string,
        client_secret: string,
        refresh_token: string,
        dateBegin?: Date,
        dateEnd?: Date,
        scale = NetatmoScale.HalfHour,
        limit = 1024,
        realTime = false,
        optimize = false
    ): Promise<Measurements> {
        await refreshTokens(client_id, client_secret, refresh_token);

        const payload = {
            /* eslint-disable @typescript-eslint/camelcase */
            device_id: stationId,
            module_id: module.id,
            scale,
            type: MeasurementsMapper.mapCapabilitiesToType(...module.capabilities),
            date_begin: dateBegin ? dateBegin.getTime() / 1000 : undefined,
            date_end: dateEnd ? dateEnd.getTime() / 1000 : undefined,
            limit,
            optimize,
            real_time: realTime,
            /* eslint-enable @typescript-eslint/camelcase */
        };

        try {
            const res = await http.get<GetMeasureResponse>(`${NETATMO_BASE_URL}/api/getmeasure`, {
                params: payload,
            });
            return MeasurementsMapper.dtoToDomain(res.data.body, module.capabilities);
        } catch (e: any) {
            logError(e);
            throw new Error();
        }
    }

    function logError(e: AxiosError): void {
        console.error(e.message);
        if (e.response) {
            console.error('Response: ' + JSON.stringify(e.response.data, undefined, 2));
        }
    }


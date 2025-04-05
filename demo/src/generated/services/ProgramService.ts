/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Program } from '../models/Program';
import type { Version } from '../models/Version';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProgramService {

    /**
     * @param id 
     * @returns any Ok
     * @throws ApiError
     */
    public static getProgram(
id: number,
): CancelablePromise<Program | null> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/programs/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @returns Program Ok
     * @throws ApiError
     */
    public static getProgramOfGroup(
id: number,
): CancelablePromise<Array<Program>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/programs/ofGroup/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns Program Ok
     * @throws ApiError
     */
    public static createProgram(
requestBody: {
groupId: number;
data: any;
},
): CancelablePromise<Program> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/programs',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns any Ok
     * @throws ApiError
     */
    public static prototypeRunProgram(
requestBody: Array<any>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/programs/prototype/run',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns any Ok
     * @throws ApiError
     */
    public static v1RunProgram(
requestBody: any,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/programs/v1/run',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param version 
     * @returns any Ok
     * @throws ApiError
     */
    public static getMetaLanguage(
version: Version,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/programs/meta/{version}',
            path: {
                'version': version,
            },
        });
    }

}

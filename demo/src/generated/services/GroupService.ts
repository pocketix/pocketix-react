/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Group } from '../models/Group';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GroupService {

    /**
     * @param id 
     * @param includeDevices 
     * @returns any Ok
     * @throws ApiError
     */
    public static getGroup(
id: number,
includeDevices?: boolean,
): CancelablePromise<Group | null> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{id}',
            path: {
                'id': id,
            },
            query: {
                'includeDevices': includeDevices,
            },
        });
    }

    /**
     * @param id 
     * @param requestBody 
     * @returns any Ok
     * @throws ApiError
     */
    public static updateGroup(
id: number,
requestBody: Group,
): CancelablePromise<Group | null> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/groups/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @returns void 
     * @throws ApiError
     */
    public static deleteGroup(
id: number,
): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/groups/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param includeDevices 
     * @returns Group Ok
     * @throws ApiError
     */
    public static getAllGroups(
includeDevices?: boolean,
): CancelablePromise<Array<Group>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups',
            query: {
                'includeDevices': includeDevices,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns Group Ok
     * @throws ApiError
     */
    public static createGroup(
requestBody: Group,
): CancelablePromise<Group> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/groups',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Device } from './Device';

export type Group = {
    id: number;
    name: string;
    devices: Array<Device>;
};

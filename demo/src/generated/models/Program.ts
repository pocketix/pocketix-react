/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Group } from './Group';
import type { Version } from './Version';

export type Program = {
    id: number;
    data: any;
    name: string;
    group: Group;
    version: Version;
};

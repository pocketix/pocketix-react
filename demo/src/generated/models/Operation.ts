/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Aggregation operations that can be used.
 * The '' type represents default aggregation (when used with aggregateMinutes) or no aggregation (when used without).
 */
export type Operation = 'mean' | 'sum' | 'last' | '' | 'none' | 'count' | 'integral' | 'median' | 'mode' | 'quantile' | 'reduce' | 'skew' | 'spread' | 'stddev' | 'timeWeightedAvg';

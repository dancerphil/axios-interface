import {OnPending} from '../types';

export const basicParamsTransform: OnPending = (params, options) => {
    if (params) {
        const {method} = options;
        const key = (method === 'GET' || method === 'DELETE') ? 'params' : 'data';
        return {[key]: params, ...options};
    }
    return options;
};

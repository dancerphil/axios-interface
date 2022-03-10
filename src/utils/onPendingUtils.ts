import {OnPending, Options} from '../types';

const getTransformKey = (options: Options) => {
    const {method, transformDeleteParamsIntoBody} = options;
    if (method === 'GET') {
        return 'params';
    }
    if (method === 'DELETE') {
        return transformDeleteParamsIntoBody ? 'data' : 'params';
    }
    return 'data';
};

export const basicParamsTransform: OnPending = (params, options) => {
    const {urlTemplate} = options;
    if (urlTemplate) {
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['x-url-template'] = urlTemplate;
    }
    if (params) {
        const key = getTransformKey(options);
        return {[key]: params, ...options};
    }
    return options;
};

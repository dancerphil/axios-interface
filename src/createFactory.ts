/**
 * @file 通用API请求功能
 * @author zhangcong06, zhanglili
 */
import axios, {AxiosResponse, AxiosError} from 'axios';
import omit from './utils/omit';
import {basicParamsTransform} from './utils/onPendingUtils';
import {OnResolve, OnReject, Options, Method, UrlTemplate, OnPending} from './types';

type OptionFunc = (options: Options) => Options;

// zero 时的配置
const passSecondThrough: OnPending = (params, options) => options;
const extractResponseData: OnResolve = value => value.data;
const throwThrough: OnReject = e => {
    throw e;
};

const getMergedOptions = (
    options: Options | OptionFunc,
    defaultOptions: Options
) => {
    if (typeof options === 'function') {
        return {...defaultOptions, ...options(defaultOptions)};
    }
    return {...defaultOptions, ...options};
};

const createFactory = (
    defaultOptions: Options = {}
) => {
    const request = (
        method: Method,
        url: string,
        params?: any,
        options: Options = {}
    ): Promise<any> => {
        // 可以在 option 里覆盖 method 和 url，不推荐这么做，但逻辑上可以
        const combinedOptions: Options = basicParamsTransform(params, {
            ...defaultOptions,
            method, url,
            ...options,
        });
        const {
            onPending,
            onResolve,
            onReject,
        } = combinedOptions;

        const combinedOnPending = onPending ?? passSecondThrough;
        const combinedOnResolve = onResolve ?? extractResponseData;
        const combinedOnReject = onReject ?? throwThrough;

        const handleResolve = (result: AxiosResponse) => {
            return combinedOnResolve(result, params, combinedOptions);
        };

        const handleReject = (reason: AxiosError) => {
            return combinedOnReject(reason, params, combinedOptions);
        };

        const config = combinedOnPending(params, combinedOptions);

        const requestPromise = config instanceof Promise
            ? config.then(awaitedConfig => axios.request(awaitedConfig))
            : axios.request(config);

        return requestPromise.then(handleResolve, handleReject);
    };

    const {interpolate = /{(\w+)}/g} = defaultOptions;

    // 使用URL的模板快速创建一个API接口
    const createInterface = <TParams = void, T = unknown>(
        method: Method,
        urlTemplate: UrlTemplate,
        options: Options | OptionFunc = {}
    ) => {
        const interfaceOptions = getMergedOptions(
            options,
            defaultOptions
        );
        interfaceOptions.urlTemplate = urlTemplate;
        const {enhance, encodePathVariable} = interfaceOptions;

        type Variables = {[key: string]: any} | undefined;
        type ToRequestUrl = (variables?: Variables) => string;
        let toRequestData = (value: any) => value;
        let toRequestUrl: ToRequestUrl = () => urlTemplate;
        // 两者有些差异，暂时与后面 replace 保持一致
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const variablesInTemplate = urlTemplate.match(interpolate);
        if (variablesInTemplate) {
            const templateKeys = variablesInTemplate.map(s => s.slice(1, -1));
            toRequestData = omit(templateKeys);
            toRequestUrl = (variables = {}) => urlTemplate.replace(interpolate, (match, name) => {
                const variable = variables[name];
                return encodePathVariable ? encodeURIComponent(variable) : variable;
            });
        }

        const templateRequest = (
            params: TParams,
            options: Options | OptionFunc = {}
        ): Promise<T> => {
            const requestUrl = toRequestUrl(params as Variables);
            const requestData = toRequestData(params);
            const requestOptions = getMergedOptions(options, interfaceOptions);
            return request(method, requestUrl, requestData, requestOptions);
        };

        if (enhance) {
            // 如果是 factory 时期的 enhance，应该被强制使用 any 这样更 general 的类型定义
            return enhance(templateRequest, interfaceOptions);
        }
        return templateRequest;
    };

    // 返回 request 以兼容一部分写法
    return {request, createInterface};
};

export default createFactory;

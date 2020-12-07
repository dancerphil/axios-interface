/**
 * @file 通用API请求功能
 * @author zhangcong06, zhanglili
 */
import axios, {AxiosResponse, AxiosError} from 'axios';
import omit from './utils/omit';
import {basicParamsTransform} from './utils/onPendingUtils';
import {OnResolve, OnReject, Enhance, Options, WarnIf, Method, UrlTemplate} from './types';

// zero 时的配置
const extractResponseData: OnResolve = value => value.data;
const throwThrough: OnReject = e => {
    throw e;
};

const getInterfaceOptions = (
    optionsOrEnhance: Options | Enhance,
    exOptions: Options,
    defaultOptions: Options
) => {
    let options: Options = {};
    if (typeof optionsOrEnhance === 'function') {
        options = exOptions;
        options.enhance = optionsOrEnhance;
    }
    else {
        options = optionsOrEnhance || {};
    }
    options = {...defaultOptions, ...options};
    return options;
};

const createFactory = (
    defaultOptions: Options = {}
) => {
    const warnIf: WarnIf = (condition, message) => {
        if (condition) {
            // eslint-disable-next-line no-console
            console.warn(message);
        }
    };

    const request = <TParams, T>(
        method: Method,
        url: string,
        params: TParams,
        options: Options = {}
    ): Promise<T> => {
        // 可以在 option 里覆盖 method 和 url，不推荐这么做，但逻辑上可以
        const combinedOptions: Options = {
            ...defaultOptions,
            method, url,
            ...options,
        };
        const {
            onPending,
            onResolve,
            onReject,
        } = combinedOptions;

        const combinedOnPending = onPending || basicParamsTransform;
        const combinedOnResolve = onResolve || extractResponseData;
        const combinedOnReject = onReject || throwThrough;

        const handleResolve = (result: AxiosResponse): T => {
            return combinedOnResolve(result, params, combinedOptions);
        };

        const handleReject = (reason: AxiosError): T => {
            return combinedOnReject(reason, params, combinedOptions);
        };

        const config = combinedOnPending(params, combinedOptions);

        return axios.request(config).then(handleResolve, handleReject);
    };

    const {interpolate = /{(\w+)}/g} = defaultOptions;

    /**
     * 使用URL的模板快速创建一个API接口
     *
     * @param {string} method HTTP动词
     * @param {string} urlTemplate URL模板，使用`{name}`作为变量占位符
     * @param {object=} optionsOrEnhance
     * @param {object=} exOptions
     * @return {Function} 一个接收`data`和`extraOptions`的API接口函数
     */
    const createInterface = <TParams = void, T = unknown>(
        method: Method,
        urlTemplate: UrlTemplate,
        optionsOrEnhance: Options | Enhance = {},
        exOptions: Options = {}
    ) => {
        const options = getInterfaceOptions(
            optionsOrEnhance,
            exOptions,
            defaultOptions
        );
        options.urlTemplate = urlTemplate;
        const {enhance} = options;

        type Variables = {[key: string]: any} | undefined;
        type ToRequestUrl = (variables: Variables) => string;
        let toRequestData = (value: any) => value;
        let toRequestUrl: ToRequestUrl = () => urlTemplate;
        // 两者有些差异，暂时与后面 replace 保持一致
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const variablesInTemplate = urlTemplate.match(interpolate);
        if (variablesInTemplate) {
            const templateKeys = variablesInTemplate.map(s => s.slice(1, -1));
            toRequestData = omit(templateKeys, warnIf);
            toRequestUrl = (variables = {}) => urlTemplate.replace(interpolate, (match, name) => variables[name]);
        }

        const templateRequest = (
            params: TParams,
            requestOptions?: Options
        ): Promise<T> => {
            const requestUrl = toRequestUrl(params);
            const requestData = toRequestData(params);
            let combinedOptions = options;

            if (requestOptions) {
                // 洛书的 enhance 模式可能会产生这个问题
                // eslint-disable-next-line max-len
                warnIf(!requestOptions.disableWarning, '在调用接口时修改了 options，这不是合适的时机，如果可以，应该在 createInterface/createVisit 阶段配置 options。设置 options.disableWarning 以禁用此警告。如果你正在使用 enhance，你可以把 options 移至第4个参数。');
                combinedOptions = {...options, ...requestOptions};
            }
            return request<TParams, T>(method, requestUrl, requestData, combinedOptions);
        };
        if (enhance) {
            // 如果是 factory 时期的 enhance，应该被强制使用 any 这样更 general 的类型定义
            return enhance(templateRequest, options);
        }
        return templateRequest;
    };

    // 返回 request 以兼容一部分写法
    return {request, createInterface};
};

export default createFactory;

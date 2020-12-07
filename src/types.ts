import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

export type WarnIf = (condition: boolean, message: string) => void;

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type UrlTemplate = string;

export type OnPending = <TParams>(params: TParams, options: Options) => Options;
export type OnResolve = <TParams>(response: AxiosResponse, params: TParams, options: Options) => any;
export type OnReject = <TParams>(response: AxiosError, params: TParams, options: Options) => any;
type Request = (params: any, options?: Options) => Promise<any>;
export type Enhance = (
    request: Request,
    options: Options,
) => Request;

export interface Options extends AxiosRequestConfig {
    onPending?: OnPending;
    onResolve?: OnResolve;
    onReject?: OnReject;
    enhance?: Enhance;
    interpolate?: RegExp; // 默认为 /{(\w+)}/g
    disableWarning?: boolean;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    [whatever: string]: any;
}

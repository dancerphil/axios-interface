import axios, {AxiosResponse, AxiosError} from 'axios';
import createFactory from './createFactory';
import {basicParamsTransform} from './utils/onPendingUtils';

const unstable_basicParamsTransform = basicParamsTransform;

// 提供 axios 以测试
export {axios, createFactory, unstable_basicParamsTransform};

// 提供 axios 的部分 ts 类型，在调整 createFactory 时可能会被使用
export {AxiosResponse, AxiosError};
export * from './types';

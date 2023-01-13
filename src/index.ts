import axios, {AxiosResponse, AxiosError} from 'axios';
import createFactory from './createFactory';

// 提供 axios 以测试
export {axios, createFactory};

// 提供 axios 的部分 ts 类型，在调整 createFactory 时可能会被使用
export type {AxiosResponse, AxiosError};
export * from './types';

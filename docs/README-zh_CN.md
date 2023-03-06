# axios-interface

[![version](https://img.shields.io/npm/v/axios-interface.svg?style=flat-square)](http://npm.im/axios-interface)
[![npm downloads](https://img.shields.io/npm/dm/axios-interface.svg?style=flat-square)](https://www.npmjs.com/package/axios-interface)
[![codecov](https://img.shields.io/codecov/c/gh/dancerphil/axios-interface)](https://codecov.io/gh/dancerphil/axios-interface)
[![MIT License](https://img.shields.io/npm/l/axios-interface.svg?style=flat-square)](http://opensource.org/licenses/MIT)

`axios-interface` 将帮助你定义 api 接口，以及其对应的类型参数。

[English](https://github.com/dancerphil/axios-interface/blob/master/README.md) | 中文

## 快速开始

```
yarn add axios-interface
```

### 基本用法

axios-interface 分为三个阶段：接口工厂 => 接口定义 => 接口调用，每个阶段传入的配置项都会覆盖前一阶段的同名配置项。

```typescript
import {createFactory} from 'axios-interface';

// 接口工厂
const {createInterface} = createFactory(options);

// 接口定义
interface Params {
    companyId: string;
    keyword?: string;
}

interface User {
    name: string;
}

const getUsers = createInterface<Params, User[]>('GET', '/rest/companies/{companyId}/users', options);

// 接口调用
const result = await getUsers({companyId: '1', keyword: 'jack'}); // GET /rest/companies/1/users?keyword=jack
```

### 配置 Options

```typescript
interface Options extends AxiosRequestConfig {
    onPending?: OnPending;
    onResolve?: OnResolve;
    onReject?: OnReject;
    interpolate?: RegExp; // 默认为 /{(\w+)}/g
    encodePathVariable?: boolean; // 是否转译 path 上的变量。如把 a/b 转译为 a%2fb。默认为 false
    transformDeleteParamsIntoBody?: boolean; // 改变 DELETE 时，对参数的处理方式，默认 DELETE 是不传 body 的，有需要时开启
    /**
     * 一些 axios 的配置项，常用的如 headers。
     * 或者你可以传任何自定义参数，它们会在三个阶段中向下传递。
     */
    [whatever: string]: any;
}

// 其中，以下类型都可以通过 import {OnPending} from 'axios-interface' 导入
type OnPending = <TParams>(params: TParams, options: Options) => Options | Promise<Options>;
type OnResolve = <TParams>(response: AxiosResponse, params: TParams, options: Options) => any;
type OnReject = <TParams>(response: AxiosError, params: TParams, options: Options) => any;
```

> NOTE: 你可以使用 [axios](https://github.com/axios/axios#request-config) 的所有配置项

```typescript
// 注意以下的所有 options，均为后者覆盖前者
const {createInterface} = createFactory(options);
const getUsers = createInterface<Params, Result>(method, urlTemplate, options);
const result = getUsers(params);
```

### onPending, onResolve, onReject 的生命周期说明

函数 call => onPending => transformRequest(axios) => 浏览器 => transformResponse(axios) => onResolve | onReject => 函数返回

### 自定义参数的使用说明

你可以在任何时候，在 options 里注入你想要的数据，在 `onPending, onResolve, onReject` 三个钩子，都会把 options 重新给你，此时，你可以根据 options 处理多种情况

### 参数声明时机

- 以下参数仅在 createFactory 时声明有效

    - interpolate，可以修改 urlTemplate 解析

- 以下参数在 createFactory 与 createInterface 时声明有效，request 时声明无效

    - encodePathVariable

- 以下参数在 createFactory、 createInterface 和 request 时声明有效

    - onPending, onResolve, onReject, transformDeleteParamsIntoBody

## 文档

[Best Practice](docs/BestPractice.md)

[FAQ](docs/FAQ.md)

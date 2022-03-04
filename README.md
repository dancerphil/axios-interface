# axios-interface

[![version](https://img.shields.io/npm/v/axios-interface.svg?style=flat-square)](http://npm.im/axios-interface)
[![npm downloads](https://img.shields.io/npm/dm/axios-interface.svg?style=flat-square)](https://www.npmjs.com/package/axios-interface)
[![codecov](https://img.shields.io/codecov/c/gh/dancerphil/axios-interface)](https://codecov.io/gh/dancerphil/axios-interface)
[![MIT License](https://img.shields.io/npm/l/axios-interface.svg?style=flat-square)](http://opensource.org/licenses/MIT)

## 快速开始

```
yarn add axios-interface
```

## GetStarted

### 基本用法

axios-interface 分为三个阶段：接口工厂 => 接口定义 => 接口调用，每个阶段传入的配置项都会覆盖前一阶段的同名配置项。

```javascript
import {createFactory} from 'axios-interface';

// 接口工厂
const {createInterface} = createFactory(options);

// 接口定义
const getUsers = createInterface('GET', '/rest/companies/{companyId}/users', options);
// 或者
const getUsers = createInterface('GET', '/rest/companies/{companyId}/users', enhance, options);

// 接口调用
const result = await getUsers(params);
```

### 配置 Options

```typescript
interface Options extends AxiosRequestConfig {
    onPending?: OnPending;
    onResolve?: OnResolve;
    onReject?: OnReject;
    enhance?: Enhance;
    interpolate?: RegExp; // 默认为 /{(\w+)}/g
    encodePathVariable?: boolean; // 是否转译 path 上的变量。如把 a/b 转译为 a%2fb。默认为 false
    transformDeleteParamsIntoBody?: boolean; // 改变 DELETE 是，对参数的处理方式，默认 DELETE 是不传 body 的，有需要时开启
    // eslint-disable-next-line @typescript-eslint/member-ordering
    [whatever: string]: any;
}

// 其中
type OnPending = <TParams>(params: TParams, options: Options) => Options | Promise<Options>;
type OnResolve = <TParams>(response: AxiosResponse, params: TParams, options: Options) => any;
type OnReject = <TParams>(response: AxiosError, params: TParams, options: Options) => any;
type Enhance = <TRequest extends (params: any, options?: Options) => Promise<any>>(
    request: TRequest,
    options: Options,
) => TRequest;

```

> NOTE: 你可以使用 [axios](https://github.com/axios/axios#request-config) 的所有配置项

```javascript
// 注意以下的所有 options，均为后者覆盖前者
const {createInterface} = createFactory(options);
const getUsers = createInterface(method, urlTemplate, options);
const result = getUsers(params);
```

### onPending, onResolve, onReject, enhance 的生命周期说明

1. 没有 enhance 的状态下 request 的整个流程

    函数 call => onPending => transformRequest(axios) => 浏览器 => transformResponse(axios) => onResolve | onReject => 函数返回

2. enhance() 是这个流程的外部包装

### whatever_you_want_to_custom 的使用说明

你可以在任何时候，在 options 里注入你想要的数据，在 `onPending, onResolve, onReject, enhance` 四个钩子，都会把 options 重新给你，此时，你可以根据 options 处理多种情况

### 参数声明时机

- 以下参数仅在 createFactory 时声明有效

    - interpolate，可以修改 urlTemplate 解析

- 以下参数在 createFactory 与 createInterface 时声明有效，request 时声明无效

    - enhance, encodePathVariable

- 以下参数在 createFactory、 createInterface 和 request 时声明有效

    - onPending, onResolve, onReject, transformDeleteParamsIntoBody

## 文档

[Best Practice](docs/BestPractice.md)

[FAQ](docs/FAQ.md)

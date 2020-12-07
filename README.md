# axios-interface

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
interface Options {
    onPending: (params, options) => options;
    onResolve: (result, params, options) => result;
    onReject: (result, params, options) => result;
    enhance: (request, options) => request,
    interpolate: RegExp; // 默认为 /{(\w+)}/g
    // 一般的
    whatever_you_want_to_custom: any; // name: string, expire: number, idempotent: boolean
    // ... 其他会透传 axios 的 options
}

```

> NOTE: 你可以使用 [axios](https://github.com/axios/axios#request-config) 的所有配置项

```javascript
// 注意以下的所有 options，均为后者覆盖前者
const {createInterface} = createFactory(options);
const getUsers = createInterface(method, urlTemplate, options);
const result = getUsers(params);
```

### onPending, onResolve, onReject, enhance

1. 没有 enhance 的状态下 request 的整个流程

    函数 call => onPending => transformRequest(axios) => 浏览器 => transformResponse(axios) => onResolve | onReject => 函数返回

2. enhance() 是这个流程的外部包装

### whatever_you_want_to_custom

你可以在任何时候，在 options 里注入你想要的数据，在 `onPending, onResolve, onReject, enhance` 四个钩子，都会把 options 重新给你，此时，你可以根据 options 处理多种情况

### 参数声明时机

- 以下参数仅在 createFactory 时声明有效

    - interpolate，可以修改 urlTemplate 解析

- 以下参数在 createFactory 与 createInterface 时声明有效，发起时声明无效

    - enhance

- 其他参数在任何时候声明有效

## 文档

[Best Practice](docs/BestPractice.md)

[FAQ](docs/FAQ.md)

## 测试

yarn test

## 如何贡献

提交 PR

## 维护者

author: [dancerphil](https://github.com/dancerphil)

contributor: [baidu efe team](https://github.com/ecomfe)

## 讨论

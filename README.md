# axios-interface

[![version](https://img.shields.io/npm/v/axios-interface.svg?style=flat-square)](http://npm.im/axios-interface)
[![npm downloads](https://img.shields.io/npm/dm/axios-interface.svg?style=flat-square)](https://www.npmjs.com/package/axios-interface)
[![codecov](https://img.shields.io/codecov/c/gh/dancerphil/axios-interface)](https://codecov.io/gh/dancerphil/axios-interface)
[![MIT License](https://img.shields.io/npm/l/axios-interface.svg?style=flat-square)](http://opensource.org/licenses/MIT)

`axios-interface` helps you to define api, along with its type.

English | [中文](https://github.com/dancerphil/axios-interface/blob/master/docs/README-zh_CN.md)

## GetStarted

```
yarn add axios-interface
```

### Basic Usage

`axios-interface` separate api into 3 stage: factory => interface => call. In each stage, you can pass in some options.

```typescript
import {createFactory} from 'axios-interface';

// factory
const {createInterface} = createFactory(options);

// interface
interface Params {
    companyId: string;
    keyword?: string;
}

interface User {
    name: string;
}

const getUsers = createInterface<Params, User[]>('GET', '/rest/companies/{companyId}/users', options);

// call
const result = await getUsers({companyId: '1', keyword: 'jack'}); // GET /rest/companies/1/users?keyword=jack
```

### About Options

```typescript
interface Options extends AxiosRequestConfig {
    onPending?: OnPending;
    onResolve?: OnResolve;
    onReject?: OnReject;
    interpolate?: RegExp; // Default as /{(\w+)}/g
    encodePathVariable?: boolean; // Parse variable like `a/b` into `a%2fb`. Default as false
    enableUrlTemplateHeaders?: boolean; // Inject `urlTemplate` into headers['x-url-template']. Default as false
    transformDeleteParamsIntoBody?: boolean; // Change the way to treat with `params` when `DELETE`. Default as false.
    /**
     * Some axios options such as headers.
     * Or whatever custom options you want. They will pass through 3 stages.
     */
    [whatever: string]: any;
}

// Some types can be imported as `import {OnPending} from 'axios-interface'`
type OnPending = <TParams>(params: TParams, options: Options) => Options | Promise<Options>;
type OnResolve = <TParams>(response: AxiosResponse, params: TParams, options: Options) => any;
type OnReject = <TParams>(response: AxiosError, params: TParams, options: Options) => any;
```

> NOTE: you can use all the configs of [axios](https://github.com/axios/axios#request-config).

```typescript
// options with same key will be covered.
const {createInterface} = createFactory(options);
const getUsers = createInterface(method, urlTemplate, options);
const result = getUsers(params);
```

### Lifecycle about onPending, onResolve, onReject

when call => onPending => transformRequest(axios) => Browsers => transformResponse(axios) => onResolve | onReject => return

### Custom Options

you can inject anything into options. In `onPending, onResolve, onReject`, options will be sent back, then you can do the logic with options and your custom onex.

### Options lifecycle that take effects

- These options take effect only in `createFactory`

    - interpolate，可以修改 urlTemplate 解析

- These options take effect in `createFactory` and `createInterface`, not in `request`

    - encodePathVariable, enableUrlTemplateHeaders

- These options take effect in `createFactory`, `createInterface` and `request`

    - onPending, onResolve, onReject, transformDeleteParamsIntoBody

## Docs

[Best Practice](docs/BestPractice.md)

[FAQ](docs/FAQ.md)

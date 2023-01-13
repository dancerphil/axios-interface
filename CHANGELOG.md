# axios-interface

## 2.0.0

- 支持 `axios@^1.0.0`

    > 值得说明的 axios 的变更：`paramsSerializer: func` 需要改为 `paramsSerializer: {serialize: func}`

- 纯 ESM 发布

- `options` 现在可以传入一个形为 `(options: Options) => Options` 的函数进行配置

- `enhance` 的写法（在 options 处传入一个特定的函数）被移除，需要改为 `{enhance}`

## 1.4.x

- `enhance` 的写法（在 options 处传入一个特定的函数）现在会得到警告，需要改为 `{enhance}`

    > 为什么？计划在 2.0.0 推出 `(options: Options) => Options` 的配置方式

- 增加 `encodePathVariable` 和 `transformDeleteParamsIntoBody` 参数

- 支持 `onPending` 为一个 async 函数

## 1.4.0

- 在没有传入 onPending 的情况下，DELETE 中的参数将被处理为 url params 而非 body，如：
  
    ```typescript
    interface ParamsDeleteUser {
        id: number;
        token?: string;
    }
    
    const apiDeleteUser = createInterface<ParamsDeleteUser>('DELETE', '/users/{id}');
    
    apiDeleteUser({id: 1, token: 'abc'}); // 将被处理为  DELETE /users/1?token=abc
    
    // 如需 body，可以声明 transformDeleteParamsIntoBody，在 createFacroty、createInterface、request 阶段进行配置（在 1.4.x 推出）
    const options = {
        // ...others
        transformDeleteParamsIntoBody: true,
    };
    ```

    > 此变更对已经声明了 onPending 的方法无影响。

# 1.3.x

- 正式对外发布

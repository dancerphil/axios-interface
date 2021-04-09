# axios-interface

## 1.4.0

- 在没有传入 onPending 的情况下，DELETE 中的参数将被处理为 url params 而非 body，如：
  
    ```typescript
    interface ParamsDeleteUser {
        id: number;
        token?: string;
    }
    
    const apiDeleteUser = createInterface<ParamsDeleteUser>('DELETE', '/users/{id}');
    
    apiDeleteUser({id: 1, token: 'abc'}); // 将被处理为  DELETE /users/1?token=abc
    
    // 如需 body，可以声明 onPending
    const onPending: OnPending = (params, options) => {
        if (params) {
            const {method} = options;
            const key = (method === 'GET' /* || method === 'DELETE' */) ? 'params' : 'data';
            return {[key]: params, ...options};
        }
        return options;
    };
    ```

    > 此变更对已经声明了 onPending 的方法无影响。

# Best Practice

## 使用自定义 options

```javascript
// 在 onResolve 处理 checkBinary
const onResolve = ({data}, options) => {
    const {checkBinary} = options
    if (checkBinary) {
        // doSomething
    }
}

// 覆盖 responseType 的配置项
const {createInterface: createFileDecodeInterface} = createFactory({
    responseType: 'arraybuffer',
    onPending,
    onResolve
})

// 创建一个 checkBinary 的接口
const apiGetFileContent = createFileDecodeInterface(
    'GET',
    '/rest/files/blob/get/fileraw',
    {checkBinary: true}
);
```

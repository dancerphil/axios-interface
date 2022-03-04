/**
 * @file import {omit} from 'lodash/fp' 的实现
 * @author zhangcong06
 * @see https://github.com/lodash/lodash/blob/es/omit.js
 * @note 简化后 omit 有何区别
 * - paths 一定是数组，而不能是 string
 * - 不能使用类似 'a.b' 的语法，除非 key === 'a.b'
 */
type Path = string;
type Paths = Path[];

const omit = (paths: Paths) => {
    return (object: any) => {
        // 总是返回新对象
        const result = {...object};
        paths.forEach(path => {
            delete result[path];
        });
        return result;
    };
};

export default omit;

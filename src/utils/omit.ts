/**
 * @file import {omit} from 'lodash/fp' 的实现
 * @author zhangcong06
 * @see https://github.com/lodash/lodash/blob/es/omit.js
 * @note 简化后 omit 有何区别
 * - paths 一定是数组，而不能是 string
 * - 不能使用类似 'a.b' 的语法，除非 key === 'a.b'
 */
import {WarnIf} from '../types';

type Path = string;
type Paths = Path[];

const noop = () => {/* empty */};

const omit = (paths: Paths, warnIf: WarnIf = noop) => {
    warnIf(!Array.isArray(paths), 'axios-interface omit 参数类型不匹配');

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

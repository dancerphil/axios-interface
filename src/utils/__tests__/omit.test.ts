/**
 * @file omit test
 * @author zhangcong06
 * @see https://github.com/lodash/lodash/blob/master/test/utils.js
 * @note 简化 omit
 */
import omitFp from '../omit';

type Path = string;
type Paths = Path[];

const omit = (object: any, paths: Paths) => omitFp(paths)(object);

describe('axios-interface omit', () => {

    // [skip] it should flatten `paths`
    // [skip] it should support deep paths
    // [skip] it should support path arrays

    // [skip string pattern]
    test('it should omit a key over a path (only array pattern)', () => {
        const object = {'a.b': 1, a: {b: 2}};
        expect(omit(object, ['a.b'])).toEqual({a: {b: 2}});
    });

    // [skip string pattern]
    test('it should coerce `paths` to strings (only array pattern)', () => {
        // @ts-ignore, 测试项
        expect(omit({0: 'a'}, [0])).toEqual({});
    });

    // [skip] it should return an empty object when `object` is nullish
    // [skip] it should work with a primitive `object`
    // [skip] it should work with `arguments` object `paths`

    // [skip string pattern]
    test('it should not mutate `object` (only array pattern)', () => {
        const object = {a: {b: 2}};
        expect(omit(object, ['a'])).toEqual({});
        expect(object).toEqual({a: {b: 2}});
    });

    // [new]
    test('it should not recognize string pattern', () => {
        const object = {a: {b: 2}};
        expect(omit(object, ['a.b'])).toEqual({a: {b: 2}});
        expect(object).toEqual({a: {b: 2}});
    });
});

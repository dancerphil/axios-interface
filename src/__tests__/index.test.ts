import * as api from '..';

describe('export api', () => {
    test('export api', () => {
        const {axios, createFactory, unstable_basicParamsTransform, ...rest} = api;
        expect(typeof axios).toBe('function');
        expect(typeof createFactory).toBe('function');
        expect(typeof unstable_basicParamsTransform).toBe('function');
        expect(rest).toEqual({});
    });
});

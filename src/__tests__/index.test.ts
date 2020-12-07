import * as api from '..';

describe('export api', () => {
    test('export api', () => {
        const {axios, createFactory, ...rest} = api;
        expect(typeof axios).toBe('function');
        expect(typeof createFactory).toBe('function');
        expect(rest).toEqual({});
    });
});

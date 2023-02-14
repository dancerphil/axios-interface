import * as mainExport from '..';
import {createFactory} from '..';

describe('export api', () => {
    test('export api', () => {
        const {axios, createFactory, ...rest} = mainExport;
        expect(typeof axios).toBe('function');
        expect(typeof createFactory).toBe('function');
        expect(rest).toEqual({});
    });

    test('createFactory api', () => {
        const {createInterface, request, options, ...rest} = createFactory();
        expect(typeof createInterface).toBe('function');
        expect(typeof createInterface).toBe('function');
        expect(typeof request).toBe('function');
        expect(typeof options).toBe('object');
        expect(rest).toEqual({});
    });

    test('createInterface api', () => {
        const {createInterface} = createFactory();
        const api = createInterface('GET', 'https://www.example.com');
        expect(typeof api).toBe('function');
        expect(typeof api.method).toBe('string');
        expect(typeof api.urlTemplate).toBe('string');
        expect(typeof api.options).toBe('object');
    });
});

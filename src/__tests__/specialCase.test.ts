import MockAdapter from 'axios-mock-adapter';
import {axios, createFactory, Enhance} from '..';

const mock = new MockAdapter(axios);
const data = {
    status: 'OK',
    data: [{name: 'test'}],
};
mock.onGet('/users').reply(200, data);

describe('enhance', () => {
    test('basic', async () => {
        const {createInterface} = createFactory();
        const enhance: Enhance = request => request;
        const getUser = createInterface('GET', '/users', v => v, {enhance});

        expect.assertions(1);
        const response = await getUser();
        expect(response).toStrictEqual(data);
    });
});

describe('async onPending', () => {
    test('basic', async () => {
        const {createInterface} = createFactory({
            onPending: async (params, options) => options,
        });
        const getUser = createInterface('GET', '/users');

        expect.assertions(1);
        const response = await getUser();
        expect(response).toStrictEqual(data);
    });
});

describe('request options', () => {
    test('', async () => {
        const {createInterface} = createFactory();
        const getUser = createInterface('GET', '/users');

        expect.assertions(1);
        const response = await getUser(undefined, {});
        expect(response).toStrictEqual(data);
    });
});

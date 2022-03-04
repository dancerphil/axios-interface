// @ts-nocheck
import MockAdapter from 'axios-mock-adapter';
import {axios, createFactory} from '..';

const {createInterface} = createFactory();

const mock = new MockAdapter(axios);

const getIdFromConfig = (config: any) => {
    const urls = config.url.split('/');
    return urls[urls.length - 1];
};

describe('axios', () => {
    test('basic axios usage', async () => {
        const users = [{id: 1, name: 'John Smith'}];
        const data = {users};
        mock.onGet('/users').reply(200, data);

        expect.assertions(1);
        const response = await axios.get('/users');
        expect(response.data).toStrictEqual(data);
    });
});

describe('basic createInterface usage', () => {
    const users = [{id: '23000019860624742X', name: 'Daniel Thomas'}];
    const getUser = createInterface('GET', '/users');

    test('basic resolve', async () => {
        const data = {
            status: 'OK',
            data: users,
        };
        mock.onGet('/users').reply(200, data);

        expect.assertions(1);
        const response = await getUser();
        expect(response).toStrictEqual(data);
    });

    test('unhandled reject', async () => {
        mock.onGet('/users').reply(502);

        expect.assertions(1);
        try {
            await getUser();
        } catch (error) {
            expect(error.message).toBe('Request failed with status code 502');
        }
    });

    test('unhandled reject with data', async () => {
        const data = {
            status: 'FORBIDDEN',
            message: 'error',
        };
        mock.onGet('/users').reply(502, data);

        expect.assertions(1);
        try {
            await getUser();
        } catch (error) {
            expect(error.message).toBe('Request failed with status code 502');
        }
    });

    test('unhandled timeout', async () => {
        mock.onGet('/users').reply(0);

        expect.assertions(1);
        try {
            await getUser();
        } catch (error) {
            expect(error.message).toBe('Request failed with status code 0');
        }
    });
});

describe('basic post/put/delete usage', () => {
    test('basic post', async () => {
        const postUser = createInterface<any>('POST', '/users');
        mock.onPost('/users').reply(config => {
            return [
                200,
                {
                    status: 'OK',
                    data: {id: '130000201201118292', ...JSON.parse(config.data)},
                },
            ];
        });

        expect.assertions(1);
        const response = await postUser({name: 'Ruth Jones'});
        expect(response).toStrictEqual({
            status: 'OK',
            data: {id: '130000201201118292', name: 'Ruth Jones'},
        });
    });

    test('basic put', async () => {
        const putUser = createInterface<any>('PUT', '/users/{id}');
        mock.onPut(/\/users\/\d+/).reply(config => {
            const id = getIdFromConfig(config);
            return [
                200,
                {
                    status: 'OK',
                    data: {id, ...JSON.parse(config.data)},
                },
            ];
        });

        expect.assertions(1);
        const response = await putUser({id: '620000199004298120', name: 'Betty Martinez'});
        expect(response).toStrictEqual({
            status: 'OK',
            data: {id: '620000199004298120', name: 'Betty Martinez'},
        });
    });

    test('basic delete', async () => {
        const deleteUser = createInterface<any>('DELETE', '/users/{id}');
        mock.onDelete(/\/users\/\d+/).reply(
            200,
            {
                status: 'OK',
                data: true,
            }
        );

        expect.assertions(1);
        const response = await deleteUser({id: '140000200609308281'});
        expect(response).toStrictEqual({data: true, status: 'OK'});
    });
});

describe('basic createInterface urlTemplate usage', () => {
    const user = {id: 1, name: 'John Smith'};
    const getUser = createInterface<any>('GET', '/users/{id}');

    test('basic resolve', async () => {
        const data = {
            status: 'OK',
            data: user,
        };
        mock.onGet(/\/users\/\d+/).reply(200, data);

        expect.assertions(1);
        const response = await getUser({id: 1});
        expect(response).toStrictEqual({
            status: 'OK',
            data: user,
        });
    });

    test('basic reject', async () => {
        const data = {
            status: 'FORBIDDEN',
            message: 'error',
        };
        mock.onGet(/\/users\/\d+/).reply(200, data);

        expect.assertions(1);
        const response = await getUser({id: 1});
        expect(response).toEqual(data);
    });

    test('unhandled reject', async () => {
        mock.onGet(/\/users\/\d+/).reply(502);

        expect.assertions(1);
        try {
            await getUser({id: 1});
        } catch (error) {
            expect(error.message).toEqual('Request failed with status code 502');
        }
    });
});

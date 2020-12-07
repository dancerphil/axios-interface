import MockAdapter from 'axios-mock-adapter';
import {axios, createFactory} from '..';

const {createInterface} = createFactory();

const mock = new MockAdapter(axios);

const getIdFromConfig = (config: any) => {
    const urls = config.url.split('/');
    return urls[urls.length - 1];
};

describe('axios', () => {
    test('basic axios usage', () => {
        const users = [{id: 1, name: 'John Smith'}];
        const data = {users};
        mock.onGet('/users').reply(200, data);

        expect.assertions(1);
        return axios.get('/users').then(response => {
            expect(response.data).toStrictEqual(data);
        });
    });
});

describe('basic createInterface usage', () => {
    const users = [{id: '23000019860624742X', name: 'Daniel Thomas'}];
    const getUser = createInterface('GET', '/users');

    test('basic resolve', () => {
        const data = {
            status: 'OK',
            data: users,
        };
        mock.onGet('/users').reply(200, data);

        expect.assertions(1);
        return getUser().then((response: any) => {
            expect(response).toStrictEqual(data);
        });
    });

    test('unhandled reject', () => {
        mock.onGet('/users').reply(502);

        expect.assertions(1);
        return getUser().catch((error: any) => {
            expect(error.message).toBe('Request failed with status code 502');
        });
    });

    test('unhandled reject with data', () => {
        const data = {
            status: 'FORBIDDEN',
            message: 'error',
        };
        mock.onGet('/users').reply(502, data);

        expect.assertions(1);
        return getUser().catch((error: any) => {
            expect(error.message).toBe('Request failed with status code 502');
        });
    });

    test('unhandled timeout', () => {
        mock.onGet('/users').reply(0);

        expect.assertions(1);
        return getUser().catch((error: any) => {
            expect(error.message).toEqual('Request failed with status code 0');
        });
    });
});

describe('basic post/put/delete usage', () => {
    test('basic post', () => {
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
        return postUser({name: 'Ruth Jones'}).then((response: any) => {
            expect(response).toStrictEqual({
                status: 'OK',
                data: {id: '130000201201118292', name: 'Ruth Jones'},
            });
        });
    });

    test('basic put', () => {
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
        return putUser({id: '620000199004298120', name: 'Betty Martinez'}).then((response: any) => {
            expect(response).toStrictEqual({
                status: 'OK',
                data: {id: '620000199004298120', name: 'Betty Martinez'},
            });
        });
    });

    test('basic delete', () => {
        const deleteUser = createInterface<any>('DELETE', '/users/{id}');
        mock.onDelete(/\/users\/\d+/).reply(
            200,
            {
                status: 'OK',
                data: true,
            }
        );

        expect.assertions(1);
        return deleteUser({id: '140000200609308281'}).then((response: any) => {
            expect(response).toStrictEqual({data: true, status: 'OK'});
        });
    });
});

describe('basic createInterface urlTemplate usage', () => {
    const user = {id: 1, name: 'John Smith'};
    const getUser = createInterface<any>('GET', '/users/{id}');

    test('basic resolve', () => {
        const data = {
            status: 'OK',
            data: user,
        };
        mock.onGet(/\/users\/\d+/).reply(200, data);

        expect.assertions(1);
        return getUser({id: 1}).then((response: any) => {
            expect(response).toStrictEqual({
                status: 'OK',
                data: user,
            });
        });
    });

    test('basic reject', () => {
        const data = {
            status: 'FORBIDDEN',
            message: 'error',
        };
        mock.onGet(/\/users\/\d+/).reply(200, data);

        expect.assertions(1);
        return getUser({id: 1}).then((response: any) => {
            expect(response).toEqual(data);
        });
    });

    test('unhandled reject', () => {
        mock.onGet(/\/users\/\d+/).reply(502);

        expect.assertions(1);
        return getUser({id: 1}).catch((error: any) => {
            expect(error.message).toEqual('Request failed with status code 502');
        });
    });
});

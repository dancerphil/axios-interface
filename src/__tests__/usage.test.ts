import MockAdapter from 'axios-mock-adapter';
import {axios, createFactory} from '..';

const withDefaultOptions = (extraOptions: any) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    const extraHeaders = extraOptions && extraOptions.headers;
    const headers = {
        ...defaultHeaders,
        ...extraHeaders,
    };
    return {headers, ...extraOptions};
};

const isFormPost = ({method, headers}: any) => {
    return method === 'POST'
        && headers
        && headers['Content-Type'] === 'application/x-www-form-urlencoded';
};

const stringifyQuery = (query: any) => {
    const e = encodeURIComponent;
    return Object.entries(query).map(([key, value]: any) => e(key) + '=' + e(value)).join('&');
};

const onPending = (params: any, options: any) => {
    const {method} = options;
    const config = withDefaultOptions(options);

    if (params) {
        const key = method === 'GET' ? 'params' : 'data';
        config[key] = params;
    }

    if (isFormPost(config)) {
        config.data = stringifyQuery(config.data);
    }

    return config;
};

const onResolve = ({data}: any) => {
    if (data.status === 'OK' || data.status === 'SUCC') {
        return data.data;
    }

    const error = new Error(data.message || '');

    throw error;
};

const onReject = ({response, message}: any) => {
    if (response && response.data && response.data.status) {
        return onResolve(response);
    }

    const error = new Error(message || '');

    throw error;
};

const {createInterface} = createFactory({onPending, onResolve, onReject});

/**
 * 开始测试
 */

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
        return getUser().then((result: any) => {
            expect(result).toStrictEqual(users);
        });
    });

    test('basic reject', () => {
        const data = {
            status: 'FORBIDDEN',
            message: 'error',
        };
        mock.onGet('/users').reply(200, data);

        expect.assertions(1);
        return getUser().catch((error: any) => {
            expect(error.message).toEqual('error');
        });
    });

    test('unhandled reject', () => {
        mock.onGet('/users').reply(502);

        expect.assertions(1);
        return getUser().catch((error: any) => {
            expect(error.message).toEqual('Request failed with status code 502');
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
            expect(error.message).toEqual('error');
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
        return postUser({name: 'Ruth Jones'}).then((result: any) => {
            expect(result).toStrictEqual({id: '130000201201118292', name: 'Ruth Jones'});
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
        return putUser({id: '620000199004298120', name: 'Betty Martinez'}).then((result: any) => {
            expect(result).toStrictEqual({id: '620000199004298120', name: 'Betty Martinez'});
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
        return deleteUser({id: '140000200609308281'}).then((result: any) => {
            expect(result).toStrictEqual(true);
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
        return getUser({id: 1}).then((result: any) => {
            expect(result).toStrictEqual(user);
        });
    });

    test('basic reject', () => {
        const data = {
            status: 'FORBIDDEN',
            message: 'error',
        };
        mock.onGet(/\/users\/\d+/).reply(200, data);

        expect.assertions(1);
        return getUser({id: 1}).catch((error: any) => {
            expect(error.message).toEqual('error');
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

describe('cover several usage', () => {
    test('form post', () => {
        const postUser = createInterface<any>(
            'POST',
            '/users',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        mock.onPost('/users').reply(config => {
            const formDataString = decodeURI(config.data);
            const [key, value] = formDataString.split('=');
            return [
                200,
                {
                    status: 'OK',
                    data: {id: '810000199301039884', [key]: value},
                },
            ];
        });

        expect.assertions(1);
        return postUser({name: 'Cynthia Gonzalez'}).then((result: any) => {
            expect(result).toStrictEqual({id: '810000199301039884', name: 'Cynthia Gonzalez'});
        });
    });

    test('X-App-Version changed', () => {
        const users = [{id: '62000020050109057X', name: 'Jessica White'}];
        const data = {
            status: 'OK',
            data: users,
        };

        const getUser = createInterface('GET', '/users');

        let isCalled = false;
        mock.onGet('/users').reply(() => {
            const mockResponse = [
                200,
                data,
                {
                    'X-App-Version': isCalled ? '430000201804212000' : '650000199401305764',
                },
            ];
            isCalled = true;
            return mockResponse;
        });

        expect.assertions(1);
        return getUser().then(() => getUser()).then((result: any) => {
            expect(result).toStrictEqual(users);
        });
    });
});

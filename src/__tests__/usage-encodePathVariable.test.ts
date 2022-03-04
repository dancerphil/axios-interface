import MockAdapter from 'axios-mock-adapter';
import {axios, createFactory} from '..';

const {createInterface: createInterface1} = createFactory();

const {createInterface: createInterface2} = createFactory({
    encodePathVariable: true,
});

const mock = new MockAdapter(axios);

interface Shape {
    id: string;
}

describe('encodePathVariable', () => {
    test('encodePathVariable: false', async () => {
        const getUser = createInterface1<Shape>('GET', '/users/{id}');
        mock.onGet(/\/users\/*/).reply(config => {
            return [
                200,
                {
                    status: 'OK',
                    url: config.url,
                },
            ];
        });

        expect.assertions(1);
        const response = await getUser({id: 'a/b'});
        expect(response).toStrictEqual({
            status: 'OK',
            url: '/users/a/b',
        });
    });

    test('encodePathVariable: false', async () => {
        const getUser = createInterface2<Shape>('GET', '/users/{id}');
        mock.onGet(/\/users\/*/).reply(config => {
            return [
                200,
                {
                    status: 'OK',
                    url: config.url,
                },
            ];
        });

        expect.assertions(1);
        const response = await getUser({id: 'a/b'});
        expect(response).toStrictEqual({
            status: 'OK',
            url: '/users/a%2Fb',
        });
    });
});

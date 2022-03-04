import MockAdapter from 'axios-mock-adapter';
import {axios, createFactory} from '..';

const {createInterface: createInterface1} = createFactory();

const {createInterface: createInterface2} = createFactory({
    transformDeleteParamsIntoBody: true,
});

const mock = new MockAdapter(axios);

interface Shape {
    id: number;
    name: string;
    gender: string;
}

describe('transformDeleteParamsIntoBody', () => {
    test('transformDeleteParamsIntoBody: false', async () => {
        const deleteUser = createInterface1<Shape>('DELETE', '/users/{id}');
        mock.onDelete(/\/users\/\d+/).reply(config => {
            return [
                200,
                {
                    status: 'OK',
                    url: config.url,
                    params: config.params,
                    data: config.data,
                },
            ];
        });

        expect.assertions(1);
        const response = await deleteUser({id: 1, name: 'John', gender: 'male'});
        expect(response).toStrictEqual({
            status: 'OK',
            url: '/users/1',
            params: {
                name: 'John',
                gender: 'male',
            },
        });
    });

    test('transformDeleteParamsIntoBody: true', async () => {
        const deleteUser = createInterface2<Shape>('DELETE', '/users/{id}?name={name}');
        mock.onDelete(/\/users\/\d+/).reply(config => {
            return [
                200,
                {
                    status: 'OK',
                    url: config.url,
                    params: config.params,
                    data: config.data,
                },
            ];
        });

        expect.assertions(1);
        const response = await deleteUser({id: 1, name: 'John', gender: 'male'});
        expect(response).toStrictEqual({
            status: 'OK',
            url: '/users/1?name=John',
            data: JSON.stringify({gender: 'male'}),
        });
    });
});

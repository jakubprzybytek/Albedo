import { get } from "aws-amplify/api";
import { addMonths, format } from 'date-fns';
import { Conjunction } from '@lambda/conjunctions';

export default async function getConjunctions(): Promise<Conjunction[]> {
    const path = '/api/conjunctions';
    const params = {
        fromTde: format(new Date(), 'yyyy-MM-dd'),
        toTde: format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
    };

    const { body } = await get({
        apiName: 'AlbedoAPI',
        path: path + '?' + new URLSearchParams(params).toString(),
    }).response;

    const bodyJson = await body.json() as any;
    return bodyJson as Conjunction[];
}

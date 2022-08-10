import { Auth, API } from "aws-amplify";
import { addMonths, format } from 'date-fns';
import { Conjunction } from '@lambda/conjunctions';

export default async function getConjunctions(): Promise<Conjunction[]> {
    const path = '/api/conjunctions';
    const params = {
        fromTde: format(new Date(), 'yyyy-MM-dd'),
        toTde: format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
    };

    return await API.get('api', path + '?' + new URLSearchParams(params).toString(), {
        headers: {
            Authorization: `Bearer ${(await Auth.currentSession())
                .getAccessToken()
                .getJwtToken()}`,
        },
    });
}
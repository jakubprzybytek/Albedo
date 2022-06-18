import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Equator, EquatorialCoordinates, Body, Observer } from 'astronomy-engine';

function dateRange(startDate: string, endDate: string, steps = 1): Date[] {
    const dateArray: Date[] = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= new Date(endDate)) {
      dateArray.push(new Date(currentDate));
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }
  
    return dateArray;
  }

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

    const ephmerides = dateRange('2022-06-16', '2023-06-15')
        .map(date => ({
            time: date,
            coords: Equator(Body.Jupiter, date, new Observer(53, 15, 100), false, false)
        }))
        .map(ephemeris => ({
            time: ephemeris.time, 
            ra: ephemeris.coords.ra, 
            dec: ephemeris.coords.dec
        }));

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ephmerides),
    };
};



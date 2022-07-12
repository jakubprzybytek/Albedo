import { describe, it, expect } from "vitest";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { getMandatoryDate } from './LamdaParams';

describe("LamdaParams", () => {
    it("should read valid date parameter", () => {
        expect(new RectangularCoordinates(1, 2, 3).add(new RectangularCoordinates(10, 20, 30))).toEqual(new RectangularCoordinates(11, 22, 33));
    });
});

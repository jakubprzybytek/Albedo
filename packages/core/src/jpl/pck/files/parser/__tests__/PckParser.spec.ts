import * as path from 'path';
import { describe, it, expect } from 'vitest';
import { PckParser } from '../PckParser';
import { loadFileTokens } from '../../TokenReader';
import { AssignementType } from '../PckParser';

describe('PckParser', () => {
  it('should parse the fixture file correctly', async () => {
    const fixturePath = path.join(__dirname, 'PckParser.fixture.tpc');
    const tokenProvider = loadFileTokens(fixturePath);
    const parser = new PckParser(tokenProvider);

    await parser.parse();

    expect(parser.assignments).toEqual([{
      type: AssignementType.SingleValue,
      variableName: "BODY399_A",
      value: 2
    }, {
      type: AssignementType.MultipleValues,
      variableName: "BODY399_RADII",
      values: [6378.1366, 6378.1366, 6356.7519]
    }
    ]);
  });

});
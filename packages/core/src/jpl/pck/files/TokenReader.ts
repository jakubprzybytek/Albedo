import * as fs from 'fs';
import * as readline from 'readline';
import { Readable } from 'stream';

export type Token = {
  value: string;
  lineNumber: number;
}

export type TokenProvider = AsyncIterableIterator<Token>;

/**
 * Generator function to load  file tokens line by line
 * @param pckFileName Path to the PCK file
 * @yields Individual tokens from the file
 */
export async function* loadFileTokens(pckFileName: string): TokenProvider {
  const fileStream = fs.createReadStream(pckFileName, { encoding: 'utf8' });
  yield* loadStreamTokens(fileStream);
}

export async function* loadStreamTokens(stream: Readable): TokenProvider {
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity // Handle Windows line endings
  });

  let lineIndex = 0;
  try {
    for await (const line of rl) {
      lineIndex++;
      const tokens = line.trim().split(/\s+/);
      for (const token of tokens) {
        if (token) {
          yield {
            value: token,
            lineNumber: lineIndex
          };
        }
      }
    }
  } finally {
    rl.close();
    stream.destroy();
  }
}

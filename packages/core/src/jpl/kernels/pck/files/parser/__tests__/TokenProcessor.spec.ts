import { describe, it, expect } from "vitest";
import { Readable } from 'stream';
import { createTokenReaderFromStream } from "../TokenReader";
import { EoFToken, CommentToken, DirectiveToken, VariableNameToken, EqualSignToken, LeftParenthesisToken, NumberToken, RightParenthesisToken } from "../Tokens";
import { consumeToken, TokenName } from "../TokenProcessor";

describe("TokenProcessor", () => {
  it("should read tokens from stream", async () => {
    const input = new Readable();
    input.push('Hello world');
    input.push(null);

    const tokenProvider = createTokenReaderFromStream(input);
    const allAllowedTokens = [CommentToken, EoFToken];

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toStrictEqual({
      type: TokenName.Comment,
      value: "Hello"
    });

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toStrictEqual({
      type: TokenName.Comment,
      value: "world"
    });

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toStrictEqual({
      type: TokenName.EoF
    });
  });

  it("should read directives", async () => {
    const input = new Readable();
    input.push('\\begindata\n');
    input.push('Comment \\begindata\n');
    input.push(null);

    const tokenProvider = createTokenReaderFromStream(input);
    const allAllowedTokens = [DirectiveToken, CommentToken, EoFToken];

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toStrictEqual({
      type: TokenName.Directive,
      value: "\\begindata"
    });

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toStrictEqual({
      type: TokenName.Comment,
      value: "Comment"
    });

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toStrictEqual({
      type: TokenName.Comment,
      value: "\\begindata"
    });

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toStrictEqual({
      type: TokenName.EoF
    });
  });

  it("should read variable name tokens from stream", async () => {
    const input = new Readable();
    input.push('BODY399_RADII     = ( 6378.1366   -6378.1366    0.14947253587500003E+06 -3.897830d-10 )');
    input.push(null);

    const tokenProvider = createTokenReaderFromStream(input);

    expect(await consumeToken(tokenProvider, [VariableNameToken])).toStrictEqual({
      type: TokenName.VariableName,
      value: "BODY399_RADII"
    });

    expect(await consumeToken(tokenProvider, [EqualSignToken])).toStrictEqual({
      type: TokenName.EqualSign,
      value: "="
    });

    expect(await consumeToken(tokenProvider, [LeftParenthesisToken])).toStrictEqual({
      type: TokenName.LeftParenthesis,
      value: "("
    });

    expect(await consumeToken(tokenProvider, [NumberToken])).toStrictEqual({
      type: TokenName.Number,
      value: 6378.1366
    });

    expect(await consumeToken(tokenProvider, [NumberToken])).toStrictEqual({
      type: TokenName.Number,
      value: -6378.1366
    });

    expect(await consumeToken(tokenProvider, [NumberToken])).toStrictEqual({
      type: TokenName.Number,
      value: 0.14947253587500003e+06
    });

    expect(await consumeToken(tokenProvider, [NumberToken])).toStrictEqual({
      type: TokenName.Number,
      value: -3.897830e-10
    });

    expect(await consumeToken(tokenProvider, [RightParenthesisToken])).toStrictEqual({
      type: TokenName.RightParenthesis,
      value: ")"
    });

    expect(await consumeToken(tokenProvider, [EoFToken])).toStrictEqual({
      type: TokenName.EoF
    });
  });

});

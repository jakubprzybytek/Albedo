import { describe, it, expect } from "vitest";
import { Readable } from 'stream';
import { loadStreamTokens } from "../../TokenReader";
import { EoFToken, CommentToken, DirectiveToken, VariableNameToken, EqualSignToken, LeftParenthesisToken, NumberToken, RightParenthesisToken } from "../Tokens";
import { consumeToken, TokenName } from "../TokenProcessor";

describe("TokenProcessor", () => {
  it("should read tokens from stream", async () => {
    const input = new Readable();
    input.push('Hello \\begin world');
    input.push(null);

    const tokenProvider = loadStreamTokens(input);
    const allAllowedTokens = [DirectiveToken, CommentToken, EoFToken];

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toEqual({
      type: TokenName.Comment,
      value: "Hello"
    });

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toEqual({
      type: TokenName.Directive,
      value: "\\begin"
    });

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toEqual({
      type: TokenName.Comment,
      value: "world"
    });

    expect(await consumeToken(tokenProvider, allAllowedTokens)).toEqual({
      type: TokenName.EoF
    });
  });

  it("should read variable name tokens from stream", async () => {
    const input = new Readable();
    input.push('BODY399_RADII     = ( 6378.1366   -6378.1366    0.14947253587500003E+06 -3.897830d-10 )');
    input.push(null);

    const tokenProvider = loadStreamTokens(input);

    expect(await consumeToken(tokenProvider, [VariableNameToken])).toEqual({
      type: TokenName.VariableName,
      value: "BODY399_RADII"
    });

    expect(await consumeToken(tokenProvider, [EqualSignToken])).toEqual({
      type: TokenName.EqualSign,
      value: "="
    });

    expect(await consumeToken(tokenProvider, [LeftParenthesisToken])).toEqual({
      type: TokenName.LeftParenthesis,
      value: "("
    });

    expect(await consumeToken(tokenProvider, [NumberToken])).toEqual({
      type: TokenName.Number,
      value: 6378.1366
    });

    expect(await consumeToken(tokenProvider, [NumberToken])).toEqual({
      type: TokenName.Number,
      value: -6378.1366
    });

    expect(await consumeToken(tokenProvider, [NumberToken])).toEqual({
      type: TokenName.Number,
      value: 0.14947253587500003e+06
    });

    expect(await consumeToken(tokenProvider, [NumberToken])).toEqual({
      type: TokenName.Number,
      value: -3.897830e-10
    });

    expect(await consumeToken(tokenProvider, [RightParenthesisToken])).toEqual({
      type: TokenName.RightParenthesis,
      value: ")"
    });

    expect(await consumeToken(tokenProvider, [EoFToken])).toEqual({
      type: TokenName.EoF
    });
  });

});

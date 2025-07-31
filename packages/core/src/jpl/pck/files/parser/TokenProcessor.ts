import { Token, TokenProvider } from "../TokenReader";

export enum TokenName {
  EoF = "EoF",
  Directive = "Directive",
  Comment = "Comment",
  VariableName = "VariableName",
  Number = "Number",
  EqualSign = "EqualSign",
  LeftParenthesis = "LeftParenthesis",
  RightParenthesis = "RightParenthesis"
}

export enum TokenParsingMethod {
  EoF,
  RegEx
}

type EoFAllowedToken = {
  parsingMethod: TokenParsingMethod.EoF;
}

type RegexAllowedToken = {
  parsingMethod: TokenParsingMethod.RegEx;
  regex: RegExp;
}

export type AllowedToken = {
  type: TokenName;
} & (EoFAllowedToken | RegexAllowedToken);

type EoFResolvedToken = {
  type: TokenName.EoF;
}

type DirectiveResolvedToken = {
  type: TokenName.Directive;
  value: string;
}

type CommentResolvedToken = {
  type: TokenName.Comment;
  value: string;
}

export type VariableNameResolvedToken = {
  type: TokenName.VariableName;
  value: string;
}

export type NumberResolvedToken = {
  type: TokenName.Number;
  value: number;
}

type EqualSignResolvedToken = {
  type: TokenName.EqualSign;
}

type LeftParenthesisResolvedToken = {
  type: TokenName.LeftParenthesis;
}

type RightParenthesisResolvedToken = {
  type: TokenName.RightParenthesis;
}

export type ResolvedToken = EoFResolvedToken | DirectiveResolvedToken | CommentResolvedToken | VariableNameResolvedToken
  | NumberResolvedToken | EqualSignResolvedToken | LeftParenthesisResolvedToken | RightParenthesisResolvedToken;

export async function consumeToken(tokenProvider: TokenProvider, allowedTokens: AllowedToken[]): Promise<ResolvedToken> {
  const currentToken = await tokenProvider.next();

  if (allowedTokens.some(token => token.parsingMethod === TokenParsingMethod.EoF)) {
    if (currentToken.done) {
      return {
        type: TokenName.EoF
      };
    }
  }

  // Check if iterator is done before accessing value
  if (currentToken.done || currentToken.value === undefined) {
    throw new Error('Unexpected end of token stream');
  }

  const regexTokens = allowedTokens.filter(token => token.parsingMethod === TokenParsingMethod.RegEx);
  const token: Token = currentToken.value;
  const tokenValue = token.value;

  for (const token of regexTokens) {
    if (token.regex.test(tokenValue)) {
      switch (token.type) {
        case TokenName.Number:
          return {
            type: token.type,
            value: Number(tokenValue.replace("d", "e").replace("D", "e"))
          };
        default:
          return {
            type: token.type,
            value: tokenValue
          };
      }
    }
  }

  throw new Error(`Unexpected token: '${tokenValue}' at line ${token.lineNumber}, expected: ${allowedTokens.map(token => token.type).join(', ')}`);
}

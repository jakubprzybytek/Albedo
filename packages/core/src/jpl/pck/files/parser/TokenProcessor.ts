import { Token, TokenProvider } from "./TokenReader";

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
  const tokenStringValue = token.value;

  for (const regexToken of regexTokens) {
    if (regexToken.regex.test(tokenStringValue)) {

      if (regexToken.type === TokenName.Directive) {
        // mach token as directive only if it is the only token in line
        if (token.line.trim() === tokenStringValue) {
          return {
            type: regexToken.type,
            value: tokenStringValue
          };
        } else {
          continue;
        }
      }

      switch (regexToken.type) {
        case TokenName.Number:
          return {
            type: regexToken.type,
            value: Number(tokenStringValue.replace("d", "e").replace("D", "e"))
          };
        default:
          return {
            type: regexToken.type,
            value: tokenStringValue
          };
      }
    }
  }

  throw new Error(`Unexpected token: '${tokenStringValue}' at line ${token.lineNumber}, expected: ${allowedTokens.map(token => token.type).join(', ')}`);
}

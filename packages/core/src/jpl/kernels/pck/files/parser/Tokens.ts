import { AllowedToken, TokenName, TokenParsingMethod } from "./TokenProcessor"

export const EoFToken: AllowedToken = {
  type: TokenName.EoF,
  parsingMethod: TokenParsingMethod.EoF
}

export const DirectiveToken: AllowedToken = {
  type: TokenName.Directive,
  parsingMethod: TokenParsingMethod.RegEx,
  regex: /^\\\w+$/
}

export const CommentToken: AllowedToken = {
  type: TokenName.Comment,
  parsingMethod: TokenParsingMethod.RegEx,
  regex: /^[^\s]+$/
}

export const VariableNameToken: AllowedToken = {
  type: TokenName.VariableName,
  parsingMethod: TokenParsingMethod.RegEx,
  regex: /^[^\\]\w+$/
}

export const NumberToken: AllowedToken = {
  type: TokenName.Number,
  parsingMethod: TokenParsingMethod.RegEx,
  regex: /^[\d-+.dDeE]+$/
}

export const EqualSignToken: AllowedToken = {
  type: TokenName.EqualSign,
  parsingMethod: TokenParsingMethod.RegEx,
  regex: /^=$/
}

export const LeftParenthesisToken: AllowedToken = {
  type: TokenName.LeftParenthesis,
  parsingMethod: TokenParsingMethod.RegEx,
  regex: /^\($/
}

export const RightParenthesisToken: AllowedToken = {
  type: TokenName.RightParenthesis,
  parsingMethod: TokenParsingMethod.RegEx,
  regex: /^\)$/
}

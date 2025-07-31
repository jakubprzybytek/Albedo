import { TokenProvider } from "../TokenReader";
import { consumeToken, ResolvedToken, TokenName, VariableNameResolvedToken } from "./TokenProcessor";
import { CommentToken, DirectiveToken, EoFToken, EqualSignToken, LeftParenthesisToken, NumberToken, RightParenthesisToken, VariableNameToken } from "./Tokens";

export enum AssignementType {
  SingleValue,
  MultipleValues
};

type SingleValueAssignment = {
  type: AssignementType.SingleValue;
  variableName: string;
  value: number;
};

type MultipleValuesAssignment = {
  type: AssignementType.MultipleValues;
  variableName: string;
  values: number[];
};

type Assignment = SingleValueAssignment | MultipleValuesAssignment;

export class PckParser {

  constructor(readonly tokenProvider: TokenProvider) { }

  public assignments: Assignment[] = [];

  async parse() {
    let result: ResolvedToken = await this.parseTextSection();

    while (result.type !== TokenName.EoF) {
      if (result.type === TokenName.Directive) {
        switch (result.value) {
          case "\\begintext":
            result = await this.parseTextSection();
            break;
          case "\\begindata":
            result = await this.parseDataSection();
            break;
          default:
            throw new Error(`Unexpected directive: '${result.value}'`);
        }
      }
    }
  }

  private async parseTextSection() {
    let resolvedToken: ResolvedToken;
    do {
      resolvedToken = await consumeToken(this.tokenProvider, [DirectiveToken, CommentToken, EoFToken]);
    } while (resolvedToken.type !== TokenName.EoF && resolvedToken.type !== TokenName.Directive);

    return resolvedToken;
  }

  private async parseDataSection() {
    let resolvedToken: ResolvedToken;
    do {
      resolvedToken = await consumeToken(this.tokenProvider, [DirectiveToken, VariableNameToken, EoFToken]);

      if (resolvedToken.type === TokenName.VariableName) {
        const assignment = await this.parseAssignment(resolvedToken);
        this.assignments.push(assignment);
      }

    } while (resolvedToken.type !== TokenName.EoF && resolvedToken.type !== TokenName.Directive);

    return resolvedToken;
  }

  private async parseAssignment(firstToken: VariableNameResolvedToken): Promise<Assignment> {
    await consumeToken(this.tokenProvider, [EqualSignToken]);

    const token = await consumeToken(this.tokenProvider, [LeftParenthesisToken, NumberToken]);

    switch (token.type) {
      case TokenName.LeftParenthesis:
        return {
          type: AssignementType.MultipleValues,
          variableName: firstToken.value,
          values: await this.parseArrayOfNumbers()
        }
      case TokenName.Number:
        return {
          type: AssignementType.SingleValue,
          variableName: firstToken.value,
          value: token.value
        }
    }

    throw new Error(`Unexpected token: ${token.type}`);
  }

  private async parseArrayOfNumbers(): Promise<number[]> {

    const numbers: number[] = [];

    let resolvedToken: ResolvedToken;
    do {
      resolvedToken = await consumeToken(this.tokenProvider, [NumberToken, RightParenthesisToken]);

      if (resolvedToken.type === TokenName.Number) {
        numbers.push(resolvedToken.value);
      }
    } while (resolvedToken.type !== TokenName.RightParenthesis);

    return numbers;
  }

}

import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerCallback,
  AuthResponse,
} from "aws-lambda";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { PolicyOptions } from "./types";

const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;
const COGNITO_USERPOOL_WEB_CLIENT_ID =
  process.env.COGNITO_USERPOOL_WEB_CLIENT_ID;

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USERPOOL_ID,
  tokenUse: "id",
  clientId: COGNITO_USERPOOL_WEB_CLIENT_ID,
});

const generatePolicy = ({ principalId, effect, resource }: PolicyOptions) => {
  const authResponse: Partial<AuthResponse> = { principalId };
  if (effect && resource) {
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    };
    authResponse.policyDocument = policyDocument;
  }
  return authResponse as AuthResponse;
};

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  _: any,
  cb: APIGatewayAuthorizerCallback
) => {
  try {
    const token = event.authorizationToken;
    await jwtVerifier.verify(token);

    const policy = generatePolicy({
      principalId: "user",
      effect: "Allow",
      resource: event.methodArn,
    });
    cb(null, policy);
  } catch (err) {
    cb("Error: Invalid token");
  }
};

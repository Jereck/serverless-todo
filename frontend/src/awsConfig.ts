import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_W0mPc7ie7',
    userPoolWebClientId: '4rh48373hi0n5ddhgsnv7r960r',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  }
})
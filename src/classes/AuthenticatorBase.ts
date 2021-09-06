import { Response } from "../types/mod.ts";

export abstract class AuthenticatorBase {
  abstract redirect(clientId: string, redirectUri: string, scopes: string, authorizationUrl: string): string;
  abstract login(
    clientId: string,
    clientSecret: string,
    accessCode: string,
    redirectUri: string,
    scopes: string,
    accessTokenUrl: string,
  ): Promise<Response>;

  abstract refresh(refreshToken: string): Promise<string>;

  abstract revoke(accessToken: string): Promise<boolean>;
}

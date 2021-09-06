// deno-lint-ignore-file
/**
 * AuthenticatorSingle
 * @author @NewtTheWolf
 */

import { buildBody } from "../utils/build_body.ts";
import { Response } from "../types/response.ts";

async function login(
  clientId: string,
  clientSecret: string,
  accessCode: string,
  redirectUri: string,
  scopes: string,
  accessTokenUrl: string,
) {
  const response = await fetch(accessTokenUrl, {
    method: "POST",
    body: buildBody({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      scope: scopes,
      code: accessCode,
    }),
  }).then((res) => res.json());

  const res: Response = {
    accessToken: response.access_token,
    tokenType: response.token_type,
    expiresIn: response.expires_in,
    refreshToken: response.refresh_token,
    scope: response.scope,
  };

  return res;
}

export class AuthenticatorSingle {
  _provider: string;
  constructor(provider: string) {
    this._provider = provider;
  }
  redirect(
    clientId: string,
    redirectUri: string,
    scopes: string = "identify email",
    authorizationUrl: string = "https://discord.com/api/oauth2/authorize",
  ) {
    switch (this._provider.toUpperCase()) {
      case "DISCORD":
        return `${authorizationUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri,
        )}&response_type=code&scope=${encodeURIComponent(scopes)}`;
      default:
        throw new Error("Invalid Provider provided");
    }
  }

  async login(
    clientId: string,
    clientSecret: string,
    accessCode: string,
    redirectUri: string,
    scopes: string,
    accessTokenUrl: string,
  ) {
    switch (this._provider.toUpperCase()) {
      case "DISCORD":
        await login(
          clientId,
          clientSecret,
          accessCode,
          redirectUri,
          scopes ?? "identify email",
          accessTokenUrl ?? "https://discord.com/api/oauth2/token",
        );
        break;
      default:
        throw new Error("Invalid Provider provided");
    }
  }
}

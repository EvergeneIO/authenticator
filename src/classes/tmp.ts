// deno-lint-ignore-file
/**
 * Authenticator
 * @author @NewtTheWolf @CuzImStantac
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

export class Authenticator {
  constructor() {}

  // discord = {
  //   redirect(
  //     clientId: string,
  //     redirectUri: string,
  //     scopes: string = "identify email",
  //     authorizationUrl: string = "https://discord.com/api/oauth2/authorize",
  //   ) {
  //     return `${authorizationUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  //       redirectUri,
  //     )}&response_type=code&scope=${encodeURIComponent(scopes)}`;
  //   },

  //   async login(
  //     clientId: string,
  //     clientSecret: string,
  //     accessCode: string,
  //     redirectUri: string,
  //     scopes: string = "identify email",
  //     accessTokenUrl: string = "https://discord.com/api/oauth2/token",
  //   ) {
  //     await login(
  //       clientId,
  //       clientSecret,
  //       accessCode,
  //       redirectUri,
  //       scopes ?? "identify email",
  //       accessTokenUrl ?? "https://discord.com/api/oauth2/token",
  //     );
  //   },
  // };
  // google = {
  //   redirect(
  //     clientId: string,
  //     redirectUri: string,
  //     scopes: string = "identify email",
  //     authorizationUrl: string = "https://discord.com/api/oauth2/authorize",
  //   ) {
  //     return `${authorizationUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  //       redirectUri,
  //     )}&response_type=code&scope=${encodeURIComponent(scopes)}`;
  //   },

  //   async login(
  //     clientId: string,
  //     clientSecret: string,
  //     accessCode: string,
  //     redirectUri: string,
  //     scopes: string = "identify email",
  //     accessTokenUrl: string = "https://discord.com/api/oauth2/token",
  //   ) {
  //     await login(
  //       clientId,
  //       clientSecret,
  //       accessCode,
  //       redirectUri,
  //       scopes ?? "identify email",
  //       accessTokenUrl ?? "https://discord.com/api/oauth2/token",
  //     );
  //   },
  // };
}

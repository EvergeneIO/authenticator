// deno-lint-ignore-file
/**
 * Authenticator
 * @author @NewtTheWolf @CuzImStantac
 */

import { buildBody } from "../utils/build_body.ts";
import { Response } from "../types/mod.ts";
import { DiscordAuthenticator, GithubAuthenticator } from "./mod.ts";

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
  discord = null;
  github = null;
  constructor(...options: AuthenticatorOptions[]) {
    this.setConfig(options);
  }

  setConfig(options: AuthenticatorOptions[]) {
    options.forEach((option: AuthenticatorOptions) => {
      const { type, clientId, clientSecret } = option;

      switch (type?.toUpperCase()) {
        case "DISCORD":
          this.discord = new DiscordAuthenticator(clientId, clientSecret);
          break;
        case "GITHUB":
          break;
        default:
          throw new Error(`Invalid type "${type?.toUpperCase()}"!`);
      }
    });
  }
}

interface AuthenticatorOptions {
  type: "DISCORD" | "GITHUB";
  clientId: string;
  clientSecret: string;
}

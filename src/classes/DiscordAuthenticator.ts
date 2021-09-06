// deno-lint-ignore-file

import { buildBody } from "../utils/build_body.ts";
import { Response } from "../types/mod.ts";
import { AuthenticatorBase } from "./mod.ts";

export class DiscordAuthenticator extends AuthenticatorBase {
  constructor(clientId?: string, clientSecret?: string) {
    super();
  }

  redirect(
    clientId: string,
    redirectUri: string,
    scopes: string = "identify email",
    authorizationUrl: string = "https://discord.com/api/oauth2/authorize",
  ) {
    return `${authorizationUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&response_type=code&scope=${encodeURIComponent(scopes)}`;
    // https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=954184149163-li1jkmvr7e3ens8ct49d4nhoaj1llkm9.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2Fcallback&access_type=offline
  }

  login(
    clientId: string,
    clientSecret: string,
    accessCode: string,
    redirectUri: string,
    scopes: string,
    accessTokenUrl: string,
  ): Promise<Response> {
    return new Promise(async (resolve) => {
      const response = await (
        await fetch(accessTokenUrl, {
          method: "POST",
          body: buildBody({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
            scope: scopes,
            code: accessCode,
          }),
        })
      ).json();

      const res: Response = {
        accessToken: response.access_token,
        tokenType: response.token_type,
        expiresIn: response.expires_in,
        refreshToken: response.refresh_token,
        scope: response.scope,
      };

      resolve(res);
    });
  }

  refresh(refreshToken: string): Promise<string> {
    return new Promise(async (resolve) => {
      resolve("myNiceToken");
    });
  }

  revoke(): Promise<boolean> {
    return new Promise(async (resolve) => {
      resolve(true);
    });
  }
}

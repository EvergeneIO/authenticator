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
  discord: DiscordAuthenticator | null = null;
  github: GithubAuthenticator | null = null;

  constructor(options?: Test) {
    if (options) this.setConfig(options);
  }

  setConfig(options: Test): boolean {
    try {
      Object.entries(options).forEach((entry) => {
        const [provider, option] = entry;
        if (provider === "custom") return;
        const { clientId, clientSecret } = option;

        switch (provider?.toUpperCase()) {
          case "DISCORD":
            this.discord = new DiscordAuthenticator(clientId, clientSecret);
            break;
          case "GITHUB":
            break;
          default:
            throw new Error(`Invalid provider "${provider?.toUpperCase()}"!`);
        }
      });
    } catch (_) {
      return false;
    }
    return true;
  }
}

interface AuthenticatorOptions<provider extends "discord" | "github"> {
  provider?: {
    clientId: string;
    clientSecret: string;
  };
}

type Test<K extends "github" | "discord" | "custom"> = {
  [P in K]: [K extends "custom" ? Record<string, ProviderSettings> : ProviderSettings];
};
//Record<"github" | "discord" | "custom", K != "custom" ? ProviderSettings : Record<string, ProviderSettings>>;

type ProviderSettings = Record<"clientId" | "clientSecret", string>;

const auth = new Authenticator({
  discord: {
    clientId: "a",
    clientSecret: "a",
  },
  github: {
    clientId: "b",
    clientSecret: "b",
  },
  microsoft: {
    clientId: "a",
    clientSecret: "a",
  },
});

console.log(auth);

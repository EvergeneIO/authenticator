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

  constructor(options?: ProviderList) {
    if (options) this.setConfig(options);
  }

  setConfig(options: ProviderList): boolean {
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

interface ProviderList {
  discord?: ProviderSettings;
  github?: ProviderSettings;
  custom?: CustomProviders;
}

//type CustomProviders = Record<string, Record<"clientId" | "clientSecret" | "redirectUri" | string, string>>;
interface CustomProviders {
  [index: string]: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    accessTokenUrl: string;
    scopes: string;
    authorizationUrl: string;
    refreshTokenUrl: string;
    revokeTokenUrl: string;
  };
}
interface ProviderSettings {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessTokenUrl?: string;
  scopes?: string;
  authorizationUrl?: string;
  refreshTokenUrl?: string;
  revokeTokenUrl?: string;
}

const auth = new Authenticator({
  discord: {
    clientId: "a",
    clientSecret: "a",
    redirectUri: "a",
  },
  custom: {
    eveonline: {
      clientId: "b",
      clientSecret: "b",
      redirectUri: "a",
      accessTokenUrl: "",
      scopes: "",
      authorizationUrl: "",
      refreshTokenUrl: "",
      revokeTokenUrl: "",
    },
    microsoft: {
      clientId: "a",
      clientSecret: "a",
      redirectUri: "a",
      accessTokenUrl: "",
      scopes: "",
      authorizationUrl: "",
      refreshTokenUrl: "",
      revokeTokenUrl: "",
    },
  },
});

console.log(auth);

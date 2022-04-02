import type { Config } from "../types/mod.ts";

export function getConfig(): Config {
  const botIdConfig = Deno.env.get("TNAB_BOT_ID");
  if (!botIdConfig) {
    throw "Missing botId";
  }

  const token = Deno.env.get("TNAB_TOKEN");
  if (!token) {
    throw "Missing token";
  }

  const applicationIdConfig = Deno.env.get("TNAB_APPLICATION_ID");
  if (!applicationIdConfig) {
    throw "Missing applicationId";
  }

  return {
    botId: BigInt(botIdConfig),
    applicationId: BigInt(applicationIdConfig),
    token,
    memeServiceEndpoint: Deno.env.get("TNAB_MEME_SERVICE_ENDPOINT"),
  } as Config;
}

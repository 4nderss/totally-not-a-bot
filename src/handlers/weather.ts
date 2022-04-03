import { Bot, Message, sendMessage } from "../../deps.ts";
import { WeatherService } from "../services/mod.ts";
import { MessageHandler } from "./types/mod.ts";

export function createHandler(weatherService: WeatherService): MessageHandler {
  const trigger = "!wääder";
  const cities = ["farsta", "sollentuna", "vallentuna", "solna"];
  return async function (
    bot: Bot,
    message: Message,
    normalizedMessageContent: string,
  ) {
    if (normalizedMessageContent.indexOf(trigger) === -1) {
      return;
    }

    const requests = cities.map((city) => weatherService.get(city));
    const weatherData = await Promise.all(requests);
    const chatMessage = weatherData.reduce(
      (builder, data) => {
        let entry = `**${data.name}**: ${Math.round(data.main.temp)} °C (Känns som: ${Math.round(data.main.feels_like)} °C)`;

        if (data.weather && data.weather[0]) {
          const weatherSymbol = getWeatherSymbol(data.weather[0].main);
          if (weatherSymbol) {
            entry += ` ${weatherSymbol}`;
          }
        }

        return builder + entry + "\n";
      },
      "",
    );
    await sendMessage(bot, message.channelId, { content: chatMessage });
  };
}

function getWeatherSymbol(description: string): string | undefined {
  switch (description.toLocaleLowerCase()) {
    case "clear":
      return "☀️";
    case "clouds":
      return "☁️";
    case "rain":
      return "🌧️";
    case "snow":
      return "🌨️";
    default:
      return undefined;
  }
}

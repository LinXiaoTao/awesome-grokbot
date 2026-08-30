import type { Bot } from "@/types";
import { codingBots } from "./coding";
import { enterpriseBots } from "./enterprise";
import { financeBots } from "./finance";
import { lifestyleBots } from "./lifestyle";
import { productivityBots } from "./productivity";
import { researchBots } from "./research";
import { socialBots } from "./social";

export const bots: Bot[] = [
  ...codingBots,
  ...enterpriseBots,
  ...financeBots,
  ...lifestyleBots,
  ...productivityBots,
  ...researchBots,
  ...socialBots,
];

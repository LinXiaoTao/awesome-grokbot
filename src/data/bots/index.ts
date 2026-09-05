import type { Bot } from "@/types";
import { designBots } from "./design";
import { engineeringBots } from "./engineering";
import { marketingBots } from "./marketing";
import { operationsBots } from "./operations";
import { personalBots } from "./personal";
import { productBots } from "./product";
import { recruitingPeopleBots } from "./recruiting-people";
import { salesBots } from "./sales";

export const bots: Bot[] = [
  ...engineeringBots,
  ...productBots,
  ...designBots,
  ...marketingBots,
  ...salesBots,
  ...operationsBots,
  ...recruitingPeopleBots,
  ...personalBots,
];

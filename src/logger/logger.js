import winston from "winston";
import { DateTime } from "luxon";

const luxonTimestamp = winston.format((info) => {
  info.timestamp = DateTime.now().setZone("Asia/Jakarta").toISODate();
  return info;
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(luxonTimestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

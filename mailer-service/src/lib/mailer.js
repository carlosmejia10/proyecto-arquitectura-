import nodemailer from "nodemailer";
import { logger } from "./logger.js";

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 465,
  secure: String(SMTP_SECURE || "true") === "true",
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

export async function verifyTransport() {
  try {
    await transporter.verify();
    logger.info("SMTP server is ready to take messages");
  } catch (err) {
    logger.error("Error verifying SMTP transporter", { err });
  }
}

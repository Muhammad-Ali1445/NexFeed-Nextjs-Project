import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.log("Resend Api Key Not avalable");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

import nodemailer from "nodemailer";
import { config } from "../config.js";

function buildTransport() {
  if (config.email.mode === "smtp") {
    return nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: config.email.user
        ? { user: config.email.user, pass: config.email.pass }
        : undefined,
    });
  }
  // Dev transport just logs
  return {
    sendMail: async (message) => {
      console.log("[EMAIL:DEV]", message);
      return { messageId: "dev-mode" };
    },
  };
}

const transport = buildTransport();

export async function sendAssignmentEmail({
  to,
  groupName,
  receiverName,
  priceMin,
  priceMax,
  groupUrl,
}) {
  const priceLine =
    priceMin || priceMax
      ? `Rango de precio: ${priceMin ? priceMin : ""}${
          priceMin && priceMax ? " - " : ""
        }${priceMax ? priceMax : ""}`
      : "";
  const text = `Tu amigo invisible para el grupo "${groupName}" es ${receiverName}.
${priceLine ? priceLine + "\n" : ""}Detalles: ${groupUrl}`;
  const html = `<p>Tu amigo invisible para <strong>${groupName}</strong> es <strong>${receiverName}</strong>.</p>${
    priceLine ? `<p>${priceLine}</p>` : ""
  }<p>Detalles: <a href="${groupUrl}">${groupUrl}</a></p>`;

  return transport.sendMail({
    from: config.email.from,
    to,
    subject: `Amigo invisible: ${groupName}`,
    text,
    html,
  });
}

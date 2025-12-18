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
  priceMax,
  groupUrl,
}) {
  const priceLine = priceMax ? `Presupuesto máximo: €${priceMax}` : "";
  const text = `Tu amigo invisible para el grupo "${groupName}" es ${receiverName}.
${priceLine ? priceLine + "\n" : ""}Detalles: ${groupUrl}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Amigo Invisible - Amigo Invisible</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);">
  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Container -->
        <table width="100%" style="max-width: 600px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">🎁</div>
              <h1 style="margin: 0; font-size: 28px; color: white; font-weight: bold;">¡Amigo Invisible Sorteado!</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">El sorteo ha sido realizado</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Greeting -->
              <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Hola 👋
              </p>

              <!-- Group Info Card -->
              <div style="background: #f9fafb; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                  Grupo
                </p>
                <h2 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: bold;">
                  ${groupName}
                </h2>
              </div>

              <!-- Result Card -->
              <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 15px 0; color: #7f1d1d; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                  Tu amigo invisible es
                </p>
                <h3 style="margin: 0; color: #1f2937; font-size: 32px; font-weight: bold;">
                  ${receiverName}
                </h3>
              </div>

              <!-- Budget Info -->
              ${
                priceLine
                  ? `
              <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 30px; padding: 15px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
                <span style="font-size: 20px;">💰</span>
                <p style="margin: 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                  ${priceLine}
                </p>
              </div>
              `
                  : ""
              }

              <!-- Action Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${groupUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 14px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 16px; transition: background 0.2s; border: 0; cursor: pointer; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);">
                  Ver Detalles del Grupo
                </a>
              </div>

              <!-- Additional Info -->
              <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #16a34a; margin-bottom: 30px;">
                <p style="margin: 0; color: #15803d; font-size: 14px; line-height: 1.6;">
                  <strong>💡 Consejo:</strong> Accede a la página del grupo para ver todos los participantes y más detalles del intercambio.
                </p>
              </div>

              <!-- Closing -->
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                ¡Que disfrutes el sorteo! 🎉
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">
                Amigo Invisible © 2025
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                Este es un correo automático, por favor no responder.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return transport.sendMail({
    from: config.email.from,
    to,
    subject: `🎁 Amigo invisible sorteado: ${groupName}`,
    text,
    html,
  });
}

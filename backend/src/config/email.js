const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar el transportador de emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar: 'gmail', 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASSWORD // Tu contraseña de aplicación
  }
});

// Función para enviar email de verificación
const sendVerificationEmail = async (userEmail, userName, token, roleTipo = 'Usuario') => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"SmartPark" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `🚗 Verifica tu cuenta de ${roleTipo} en SmartPark`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            margin: 50px auto; 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
          }
          .header { 
            text-align: center; 
            color: #3b82f6; 
            margin-bottom: 30px; 
          }
          .button { 
            display: inline-block; 
            padding: 15px 30px; 
            background-color: #3b82f6; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0; 
            font-weight: bold; 
          }
          .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #eee; 
            color: #666; 
            font-size: 12px; 
            text-align: center; 
          }
          .warning { 
            background-color: #fef3c7; 
            padding: 15px; 
            border-radius: 5px; 
            margin-top: 20px; 
            color: #92400e; 
          }
          .role-badge {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 SmartPark</h1>
            <h2>¡Bienvenido ${userName}!</h2>
            <div class="role-badge">${roleTipo}</div>
          </div>
          
          <p>Gracias por registrarte en SmartPark. Para completar tu registro y activar tu cuenta de <strong>${roleTipo}</strong>, por favor verifica tu dirección de correo electrónico.</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">
              ✅ Verificar mi cuenta
            </a>
          </div>
          
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
            ${verificationUrl}
          </p>
          
          <div class="warning">
            ⚠️ <strong>Importante:</strong> Este enlace expirará en 24 horas.
          </div>
          
          <div class="footer">
            <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
            <p>© 2025 SmartPark. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de verificación enviado a: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
};

// Función para enviar email de recuperación de contraseña
const sendPasswordResetEmail = async (userEmail, userName, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"SmartPark" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🔒 Recuperación de contraseña - SmartPark',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 50px auto; background: white; padding: 30px; border-radius: 10px; }
          .header { text-align: center; color: #3b82f6; margin-bottom: 30px; }
          .button { display: inline-block; padding: 15px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background-color: #fee2e2; padding: 15px; border-radius: 5px; margin-top: 20px; color: #991b1b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 SmartPark</h1>
            <h2>Recuperación de Contraseña</h2>
          </div>
          
          <p>Hola ${userName},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">
              🔑 Restablecer Contraseña
            </a>
          </div>
          
          <div class="warning">
            ⚠️ Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este correo.
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email de recuperación enviado a: ${userEmail}`);
};

// Función para enviar email cuando se agrega un nuevo rol a una cuenta existente
const sendRoleAddedEmail = async (userEmail, userName, nuevoRol, rolesExistentes, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"SmartPark" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `🎉 Nuevo rol de ${nuevoRol} agregado - SmartPark`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            margin: 50px auto; 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
          }
          .header { 
            text-align: center; 
            color: #3b82f6; 
            margin-bottom: 30px; 
          }
          .button { 
            display: inline-block; 
            padding: 15px 30px; 
            background-color: #10b981; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0; 
            font-weight: bold; 
          }
          .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #eee; 
            color: #666; 
            font-size: 12px; 
            text-align: center; 
          }
          .info-box { 
            background-color: #dbeafe; 
            padding: 20px; 
            border-radius: 5px; 
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
          }
          .warning { 
            background-color: #fef3c7; 
            padding: 15px; 
            border-radius: 5px; 
            margin-top: 20px; 
            color: #92400e; 
          }
          .role-badge {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin: 5px;
          }
          .existing-role {
            background-color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 SmartPark</h1>
            <h2>¡Hola ${userName}!</h2>
          </div>
          
          <p>Detectamos que intentaste registrarte con credenciales que ya están asociadas a tu cuenta en SmartPark.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #3b82f6;">📋 Estado de tu Cuenta</h3>
            <p><strong>Roles existentes:</strong></p>
            ${rolesExistentes.map(role => `<div class="role-badge existing-role">${role}</div>`).join('')}
            
            <p style="margin-top: 15px;"><strong>Nuevo rol agregado:</strong></p>
            <div class="role-badge">${nuevoRol}</div>
          </div>
          
          <p><strong>✅ ¡Buenas noticias!</strong> Hemos agregado el rol de <strong>${nuevoRol}</strong> a tu cuenta existente.</p>
          
          <p>Para activar este nuevo rol, por favor verifica tu identidad haciendo clic en el botón de abajo:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">
              🎉 Activar rol de ${nuevoRol}
            </a>
          </div>
          
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
            ${verificationUrl}
          </p>
          
          <div class="info-box">
            <h4 style="margin-top: 0;">🔑 Información Importante</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Tus credenciales (usuario y contraseña) siguen siendo las mismas</li>
              <li>Ahora podrás acceder tanto como ${rolesExistentes.join(', ')} como ${nuevoRol}</li>
              <li>Solo necesitas elegir el rol correcto al iniciar sesión</li>
            </ul>
          </div>
          
          <div class="warning">
            ⚠️ <strong>Importante:</strong> Este enlace expirará en 24 horas.
          </div>
          
          <div class="footer">
            <p>Si no solicitaste este cambio, por favor contacta con soporte inmediatamente.</p>
            <p>© 2025 SmartPark. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de nuevo rol enviado a: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendRoleAddedEmail,
  transporter
};
'use strict';
const nodemailer = require('nodemailer');

require('dotenv').config();

const emailUser: string = process.env.EMAIL_USER as string;
const emailPassword: string = process.env.EMAIL_PASSWORD as string;

const fs = require('fs');
const path = require('path');

const emailTemplateSource = fs.readFileSync(
	path.join(
		__dirname,
		'/../../../src/util/email-templates/text_and_button.template.html'
	),
	'utf8'
);

const textTemplateSource = fs.readFileSync(
	path.join(
		__dirname,
		'/../../../src/util/email-templates/text.template.html'
	),
	'utf8'
);

import Handlebars from 'handlebars';

export class EmailService {
	async sendEmail(
		user: string,
		pass: string,
		to: string,
		cc: any,
		subject: string,
		html: string,
	) {
		try {
			const message = {
				from: emailUser,
				to: to,
				subject: subject,
				html: html,
			};
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				// host: 'smtp.gmail.com ',
				// port: 465,
				// secure: true,
				auth: {
					user: emailUser,
					pass: emailPassword,
				},
			});

			return new Promise((resolve, reject) => {
				transporter.sendMail(message, function (error: any, info: any) {
					if (error) {
						return reject(error)
					}
					return resolve(info);
				});
			});
		} catch (error) {
			throw error;
		}
	}

	async sendActivateUserEmail(aUserEmail: string, token: string) {
		const asunto = 'Registro exitoso! Active su cuenta - MIC';

		const template = Handlebars.compile(emailTemplateSource);
		const htmlToSend = template({
			title: '¡Bienvenido a MIC!',
			body: 'Ahora que te has registrado, necesitas confirmar tu dirección de correo electrónico para activar tu cuenta, haciendo click en el siguiente botón.',
			buttonText: 'Activa tu cuenta!',
			buttonLink: process.env.FRONT_URL + '/register/email-verified/' + token,
			footer:
				'Si no solicitaste registrarte, puedes simplemente ignorar este mail.',
		});

		try {
			const send = await this.sendEmail(
				emailUser,
				emailPassword,
				aUserEmail,
				null,
				asunto,
				htmlToSend
			);

			return send;
		} catch (error) {
			throw error;
		}
	}

	async sendRestorePasswordEmail(aUserEmail: string, token: string) {
		const asunto = 'Reestablecer contraseña';

		const template = Handlebars.compile(emailTemplateSource);

		const htmlToSend = template({
			title: 'Recupere su acceso a MIC',
			body: 'Hemos recibido una solicitud de restablecimiento de contraseña de tu cuenta. \nHaz clic en el botón que aparece a continuación para cambiar tu contraseña.\nTen en cuenta que este enlace es válido solo durante 24 horas. Una vez transcurrido el plazo, deberás volver a solicitar el restablecimiento de la contraseña.',
			// body: 'Es necesario que ingrese al siguiente enlace y complete los datos pedidos para volver a tener acceso a nuestra plataforma.',
			buttonText: 'Cambia tu contraseña',
			buttonLink: `${process.env.FRONT_URL}/restorePassword/${token}`,
			footer:
				'Si no solicitaste recuperar tu contraseña, puedes simplemente ignorar este mail.',
		});
		try {
			const send = await this.sendEmail(
				emailUser,
				emailPassword,
				aUserEmail,
				null,
				asunto,
				htmlToSend
			);

			return send;
		} catch (error) {
			throw error;
		}
	}

	async sendInfo(aUserEmail: string, body: string) {
		const asunto = 'Informacion sobre su organizacion/institucion';

		const template = Handlebars.compile(textTemplateSource);
		const htmlToSend = template({
			title: 'Actualizacion de estado',
			body: body,
			footer:
				'Si no solicitaste el alta de una organizacion/institucion, puedes simplemente ignorar este mail.',
		});

		try {
			const send = await this.sendEmail(
				emailUser,
				emailPassword,
				aUserEmail,
				null,
				asunto,
				htmlToSend
			);

			return send;
		} catch (error) {
			throw error;
		}
	}

	async sendEmailNotification(title: string, description: string, aUserEmail: string, link: string) {
		const asunto = 'MIC - Mapa interactivo cultural';

		const template = Handlebars.compile(emailTemplateSource);
		const htmlToSend = template({
			title: title,
			body: description,
			buttonText: 'Ver detalle',
			buttonLink: process.env.FRONT_URL + link,
			footer:
				'Este mensaje es una copia de la notificación enviada al dispositivo conectado.',
		});

		try {
			const send = await this.sendEmail(
				emailUser,
				emailPassword,
				aUserEmail,
				null,
				asunto,
				htmlToSend
			);

			return send;
		} catch (error) {
			throw error;
		}
	}
}

// ¡Bienvenido a MIC!

// Ahora que te has registrado, necesitas confirmar tu dirección de correo electrónico para activar tu cuenta, haciendo click en el siguiente link:
// Si no solicitaste registrarte, puedes ignorar este mail.

import { GOOGLE_EMAIL } from "$env/static/private";
import transporter from "$lib/emailSetup.server.js";
import { redirect } from "@sveltejs/kit";

export function load() {
		redirect(307, '/auth/login');
}

export const actions = {
    default: async ({ request }) => {
        try {
            // const formData = await request.formData();
            const email = "wtmaceda@up.edu.ph";
            const subject = "Test subject";
            const body = "this is a test email"
            console.log(body);
            let html = `<h2>Hi!</h2><pre>${body}</pre>`;

            const message = {
                from: GOOGLE_EMAIL,
                to: email,
                bcc: "jelamay.yap@gmail.com",
                subject: subject,
                text: body,
                html: html,
            };

            const sendEmail = async (message) => {
                await new Promise((resolve, reject) => {
                    transporter.sendMail(message, (err, info) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(info);
                        }
                    });
                });
            };

            await sendEmail(message);

            return {
                success: "Email is sent",
            };
        } catch (error) {
            console.error(error);
        }
    }
};
import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendEmail = async (options) =>{
    const mailGenerator = new Mailgen({
        theme: "default",
        product:{
            name:"Task Manager",
            link:"https://taskmanagelink.com"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContext)
    const emailHtml = mailGenerator.generate(
      options.mailgenContext,
    );

   const transporter =  nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = {
        from:"mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }

    try{
        await transporter.sendMail(mail)
    }catch(err){
        console.error("email service failed silently. Make sure that you have provided your MAILTRAP credentials in the .env file ")
        console.error("Error:",error)
    }

}

const emaiVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we are excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      ourtro:
        "Need help, or have questions? Just reply to this email,we'd love to help. ",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions: "To reset your password click on the following button",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      ourtro:
        "Need help, or have questions? Just reply to this email,we'd love to help. ",
    },
  };
};




export {
  emaiVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail
};
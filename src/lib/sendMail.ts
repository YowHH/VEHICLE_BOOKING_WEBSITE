import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

export const sendMail = async (to:string, subject:string, html:string) => {
    await transporter.sendMail({
        from:`"RYDEX" <${process.env.EMAIL}>`,
        to,
        subject,
        html
    })
}
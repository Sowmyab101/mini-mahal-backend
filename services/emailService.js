const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendBookingEmail(booking) {

    // Works for both Website and WhatsApp bookings
    const phone = booking.customerPhone || booking.phone;
    const timing = booking.timing || booking.timings;

    const timingMap = {
        "Early Morning": { start: "060000", end: "090000" },
        "Mid Morning": { start: "090000", end: "120000" },
        "Afternoon": { start: "130000", end: "160000" },
        "Evening": { start: "170000", end: "210000" }
    };

    const startDate = booking.date.replace(/-/g, "");
    const endDate = booking.date.replace(/-/g, "");

    const startTime = timingMap[timing].start;
    const endTime = timingMap[timing].end;

const calendarLink =
`https://calendar.google.com/calendar/render?action=TEMPLATE` +
`&text=${encodeURIComponent("Event at Sri Sai Krishna Mahal")}` +
`&dates=${startDate}T${startTime}/${endDate}T${endTime}` +
`&details=${encodeURIComponent(
`Booking for ${booking.eventType}
Name: ${booking.name}
Phone: ${phone}
Email: ${booking.email}`
)}` +
`&location=${encodeURIComponent("Sri Sai Krishna Mahal, YOUR ADDRESS")}`;

    const mailOptions = {
        from: `"Sri Sai Krishna Mahal" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: "Booking Confirmed",
         html: `<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1">

</head>

<body style="margin:0;background:#f7f4ef;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">

<tr>

<td align="center">

<table width="650" cellpadding="0" cellspacing="0"

style="background:white;border-radius:12px;overflow:hidden;
box-shadow:0 5px 18px rgba(0,0,0,.15);">


<!-- HEADER -->

<tr>

<td align="center"

style="background:#b38f2d;padding:40px;">

<h1 style="color:white;margin:0;font-size:36px;">

Sri Sai Krishna Mahal

</h1>

<p style="color:white;font-size:18px;margin-top:12px;">

✨ Booking Confirmation ✨

</p>

</td>

</tr>


<!-- MESSAGE -->

<tr>

<td style="padding:40px;">

<h2 style="color:#7a1c2e;margin-top:0;">

Hello ${booking.name},

</h2>

<p style="font-size:16px;color:#555;line-height:1.8;">

Thank you for choosing

<b>Sri Sai Krishna Mahal.</b>

</p>

<p style="font-size:16px;color:#555;line-height:1.8;">

Your booking has been

<b style="color:green;">

confirmed successfully.

</b>

We are delighted to be a part of your special celebration.

</p>

</td>

</tr>



<!-- BOOKING DETAILS -->

<tr>

<td style="padding:0 40px 35px;">


<table width="100%"

cellpadding="12"

style="border-collapse:collapse;
background:#faf7f2;
border:1px solid #e6d7b5;">

<tr>

<td colspan="2"

style="background:#b38f2d;
color:white;
font-size:22px;
text-align:center;">

📋 Booking Details

</td>

</tr>


<tr>

<td><b>👤 Name</b></td>

<td>${booking.name}</td>

</tr>

<tr style="background:white;">

<td><b>🎉 Event</b></td>

<td>${booking.eventType}</td>

</tr>

<tr>

<td><b>📅 Date</b></td>

<td>${booking.date}</td>

</tr>

<tr style="background:white;">

<td><b>⏰ Timing</b></td>

<td>${timing}</td>

</tr>

<tr>

<td><b>📞 Phone</b></td>

<td>${booking.phone}</td>

</tr>

<tr style="background:white;">

<td><b>📧 Email</b></td>

<td>${booking.email}</td>

</tr>

</table>

</td>

</tr>



<!-- BUTTONS -->

<tr>

<td align="center">

<table cellpadding="10">

<tr>

<td>

<a href="${calendarLink}"

style="

background:#34A853;

color:white;

text-decoration:none;

padding:15px 25px;

border-radius:6px;

font-weight:bold;

display:inline-block;

">

📅 Add to Google Calendar

</a>

</td>

<td>

<a href="https://YOUR_WEBSITE_URL"

style="

background:#b38f2d;

color:white;

text-decoration:none;

padding:15px 25px;

border-radius:6px;

font-weight:bold;

display:inline-block;

">

🌐 Visit Website

</a>

</td>

</tr>

</table>

</td>

</tr>



<!-- CONTACT -->

<tr>

<td style="padding:40px;">

<h3 style="color:#7a1c2e;">

Need Assistance?

</h3>

<p style="line-height:2;color:#555;">

📍 Sri Sai Krishna Mahal

<br>

Kachalan street, Belliyappa Nagar, Walajapet, Ranipent District, Tamil Nadu

<br><br>

📞 +91 93441 64909- Manager Contact

<br><br>

📧 srisaiKrishnaMahal@gmail.com

</p>

</td>

</tr>



<!-- FOOTER -->

<tr>

<td

style="background:#f4efe4;
padding:30px;
text-align:center;
color:#666;
font-size:14px;">

Thank you for choosing

<b>Sri Sai Krishna Mahal.</b>

<br><br>

We look forward to making your event

beautiful, memorable, and truly special.

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>



};`




};
await transporter.sendMail(mailOptions);
}

module.exports = { sendBookingEmail };
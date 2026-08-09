const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const selectedTiming = timingMap[timing];

    if (!selectedTiming) {
        throw new Error(`Invalid booking timing: ${timing}`);
    }

    const startTime = selectedTiming.start;
    const endTime = selectedTiming.end;

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
        `&location=${encodeURIComponent(
            "Sri Sai Krishna Mahal, Kachalan street, Belliyappa Nagar, Walajapet, Ranipet District, Tamil Nadu"
        )}`;

    const websiteUrl = "https://myfirstproject-1cc9f.web.app";

    const { data, error } = await resend.emails.send({
        from: "Sri Sai Krishna Mahal <onboarding@resend.dev>",
        to: booking.email,
        subject: "Booking Confirmed",
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Booking Confirmation</title>
</head>

<body style="margin:0;padding:20px;background:#f4efe4;font-family:Arial,sans-serif;">

    <div style="
        max-width:650px;
        margin:auto;
        background:white;
        border-radius:12px;
        overflow:hidden;
        box-shadow:0 5px 18px rgba(0,0,0,.15);
    ">

        <div style="
            background:#b38f2d;
            padding:40px;
            text-align:center;
            color:white;
        ">
            <h1 style="margin:0 0 10px;">
                Sri Sai Krishna Mahal
            </h1>

            <h2 style="margin:0;">
                ✨ Booking Confirmation ✨
            </h2>
        </div>

        <div style="padding:35px;">

            <p>Hello <strong>${booking.name}</strong>,</p>

            <p>
                Thank you for choosing
                <strong>Sri Sai Krishna Mahal</strong>.
            </p>

            <p>
                Your booking has been
                <strong>confirmed successfully.</strong>
            </p>

            <p>
                We are delighted to be a part of your special celebration.
            </p>

            <table
                cellpadding="12"
                cellspacing="0"
                width="100%"
                style="
                    border-collapse:collapse;
                    background:#faf7f2;
                    border:1px solid #e6d7b5;
                    margin-top:25px;
                "
            >

                <tr>
                    <td colspan="2"
                        style="
                            background:#b38f2d;
                            color:white;
                            font-size:22px;
                            text-align:center;
                            font-weight:bold;
                        ">
                        📋 Booking Details
                    </td>
                </tr>

                <tr>
                    <td><strong>Name</strong></td>
                    <td>${booking.name}</td>
                </tr>

                <tr>
                    <td><strong>Phone</strong></td>
                    <td>${phone}</td>
                </tr>

                <tr>
                    <td><strong>Email</strong></td>
                    <td>${booking.email}</td>
                </tr>

                <tr>
                    <td><strong>Event Type</strong></td>
                    <td>${booking.eventType}</td>
                </tr>

                <tr>
                    <td><strong>Date</strong></td>
                    <td>${booking.date}</td>
                </tr>

                <tr>
                    <td><strong>Timing</strong></td>
                    <td>${timing}</td>
                </tr>

            </table>

            <div style="text-align:center;margin-top:30px;">

                <a href="${calendarLink}"
                   style="
                       background:#34A853;
                       color:white;
                       text-decoration:none;
                       padding:15px 25px;
                       border-radius:6px;
                       font-weight:bold;
                       display:inline-block;
                       margin:5px;
                   ">
                    📅 Add to Google Calendar
                </a>

                <a href="${websiteUrl}"
                   style="
                       background:#b38f2d;
                       color:white;
                       text-decoration:none;
                       padding:15px 25px;
                       border-radius:6px;
                       font-weight:bold;
                       display:inline-block;
                       margin:5px;
                   ">
                    🌐 Visit Website
                </a>

            </div>

            <div style="
                margin-top:35px;
                padding:20px;
                background:#faf7f2;
                border-radius:8px;
            ">

                <h3>Need Assistance?</h3>

                <p>
                    📍 Sri Sai Krishna Mahal<br>
                    Kachalan Street, Belliyappa Nagar,<br>
                    Walajapet, Ranipet District, Tamil Nadu
                </p>

                <p>
                    📞 +91 93441 64909 - Manager Contact
                </p>

                <p>
                    📧 srisaiKrishnaMahal@gmail.com
                </p>

            </div>

        </div>

        <div style="
            background:#f4efe4;
            padding:30px;
            text-align:center;
            color:#666;
            font-size:14px;
        ">

            <p>
                Thank you for choosing
                <strong>Sri Sai Krishna Mahal.</strong>
            </p>

            <p>
                We look forward to making your event
                beautiful, memorable, and truly special.
            </p>

        </div>

    </div>

</body>
</html>
`
    });

    if (error) {
        console.error("Resend email error:", error);
        throw error;
    }

    console.log("Booking confirmation email sent:", data.id);
}

module.exports = { sendBookingEmail };
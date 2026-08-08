const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json());
app.use(uploadRoutes);



const { sendBookingEmail } = require("./services/emailService");

app.post("/website-booking", async (req, res) => {

    try {

        const booking = req.body;

        await sendBookingEmail(booking);

        res.json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {

        console.error("Email Error:", error);

        res.status(500).json({
            success: false,
            message: "Email failed"
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
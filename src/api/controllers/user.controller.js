const requestSession = (req, res) => {
    const regnumber = req.query.regnumber;

    if (!regnumber) {
        return res.status(400).json({ message: "Registration number is required." });
    }

    const responseMessage = `Session was guaranteed for student with registration number: ${regnumber}`;
    
    return res.status(200).json({ message: responseMessage });
};

export default {
    requestSession,
};
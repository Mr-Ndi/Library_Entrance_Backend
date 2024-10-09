const requestSession = (req, res) => {
    const {reg} = req.params;

    if (!reg) {
        return res.status(400).json({ message: "Registration number is required." });
    }

    const responseMessage = `Session was guaranteed for student with registration number: ${reg}`;
    
    return res.status(200).json({ message: responseMessage });
};

export default {
    requestSession,
};
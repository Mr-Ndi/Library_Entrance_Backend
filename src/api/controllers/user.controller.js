const requestSession = (req, res) => {
    const {reg} = req.params;

    if (!reg) {
        return res.status(400).json({ status: 0 });
    }    
    return res.status(200).json({ status: 1 });
};

export default { requestSession };
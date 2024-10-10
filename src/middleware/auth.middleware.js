const requestSession = async (req, res) => {
    const regnumber = req.params.reg;
    try {
        const exists = await userService.checkRegNumberExists(regnumber);
        
        if (!exists) {
            return res.status(404).json({ message: 0 });
        }
        res.json({ status: 1 });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

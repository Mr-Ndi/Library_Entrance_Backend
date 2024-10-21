const ticketIdGenerator = (regNumber) => {

    // Like (/^UR\d{10}-\d{4}$/);
    
    const last4 = regNumber.toString().slice(-4);
    return (
        `UR${Date.now()}-${last4}`
    )
};

export default ticketIdGenerator;
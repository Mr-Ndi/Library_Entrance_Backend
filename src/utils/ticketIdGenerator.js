const ticketIdGenerator = (regNumber) => {

    // Like (/^UR\<epoch time>-\d{4}$/);

    if (!regNumber)
        throw new Error("Registration number is required");    
    const last4 = regNumber.toString().slice(-4);
    return (
        `UR${Date.now()}-${last4}`
    )
};

export default ticketIdGenerator;
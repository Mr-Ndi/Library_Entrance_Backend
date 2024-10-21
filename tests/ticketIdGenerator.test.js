import ticketIdGenerator from "../src/utils/ticketIdGenerator";

describe('ticketIdGenerator', () => {
    const regNumber = 222003832; // Example registration number

    it('should return a string', () => {
        const id = ticketIdGenerator(regNumber);
        expect(typeof id).toBe('string');
    });

    it('should start with "UR"', () => {
        const id = ticketIdGenerator(regNumber);
        expect(id.startsWith('UR')).toBe(true);
    });

    it('should contain the last 4 digits of the registration number at the end', () => {
        const id = ticketIdGenerator(regNumber);
        const last4 = regNumber.toString().slice(-4);
        expect(id.endsWith(`-${last4}`)).toBe(true);
    });

    it('should have an epoch timestamp in the correct position', () => {
        const id = ticketIdGenerator(regNumber);
        const parts = id.match(/^UR(\d+)-(\d{4})$/);
        console.log(parts);
        expect(parts).not.toBeNull(); // Ensures the format is valid
        const timestamp = parseInt(parts[1], 10);

        // Check if the timestamp is within a reasonable range (e.g., last 1 minute)
        const currentTimestamp = Date.now();
        const oneMinuteAgo = currentTimestamp - 60 * 1000;
        expect(timestamp).toBeGreaterThan(oneMinuteAgo);
        expect(timestamp).toBeLessThanOrEqual(currentTimestamp);
    });
});

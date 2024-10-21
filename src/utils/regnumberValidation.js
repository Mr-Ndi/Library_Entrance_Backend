function validateSRN(srn, expectedLevel) {

    const srnPattern = /^\d{9}$/;
    if (!srnPattern.test(srn)) {
        return { isValid: false, message: 'Invalid SRN format. Must be 9 digits.' };
    }

    const studentLevelDigit = srn.charAt(1);
    let studentLevel;

    switch (studentLevelDigit) {
        case '4':
            studentLevel = 1;
            break;
        case '3':
            studentLevel = 2;
            break;
        case '2':
            studentLevel = 3;
            break;
        case '1':
            studentLevel = 4;
            break;
        default:
            return { isValid: false, message: 'Invalid SRN. Third digit does not correspond to a valid level.' };
    }


    if (studentLevel !== expectedLevel) {
        return { isValid: false, message: `Expected level ${expectedLevel}, but found level ${studentLevel}.` };
    }

    return { isValid: true, message: 'Valid SRN and level match.' };
}
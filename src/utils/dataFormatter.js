const dataFormatter = (data) => {
    const {__v, ...newData} = data.toObject();
    return newData;
}

export default dataFormatter;
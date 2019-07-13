function mapData(obj1, obj2) {

    if (obj2.name)
        obj1.name = obj2.name;
    if (obj2.email)
        obj1.email = obj2.email;
    if (obj2.username)
        obj1.username = obj2.username;
    if (obj2.password)
        obj1.password = obj2.password;
    if (obj2.phone)
        obj1.phone = obj2.phoneNumber;
    if (obj2.tempAddr || obj2.permanentAddr)
        obj1.address = {
            temporaryAddress: obj2.tempAddr,
            permanentAddress: obj2.permanentAddr
        };
    if (obj2.hobbies)
        obj1.hobbies = obj2.hobbies.split(',');
    if (obj2.dob)
        obj1.dob = new Date(obj2.dob);
    if (obj2.gender)
        obj1.gender = obj2.gender;
    if (obj2.role)
        obj1.role = obj2.role;

    return obj1;
}


module.exports = mapData;
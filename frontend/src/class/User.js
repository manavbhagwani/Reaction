class User {
    constructor({ email, phoneNumber, userName, src, about }) {
        if (!(email instanceof String))
            throw TypeError(
                "Property 'email' of class 'User' must be a 'String'!"
            );
        this.email = email;
        if (!(phoneNumber instanceof Number))
            throw TypeError(
                "Property 'phoneNumber' of class 'User' must be a 'Number'!"
            );
        this.phoneNumber = phoneNumber;
        if (!(userName instanceof String))
            throw TypeError(
                "Property 'userName' of class 'User' must be a 'String'!"
            );
        this.userName = userName;
        if (!(src instanceof String))
            throw TypeError(
                "Property 'src' of class 'User' must be a 'String'!"
            );
        this.src = src;
        if (!(about instanceof String))
            throw TypeError(
                "Property 'about' of class 'User' must be a 'String'!"
            );
        this.about = about;
    }
}

export default User;

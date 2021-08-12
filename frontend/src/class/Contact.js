import User from "./User";

class Contact extends User {
    constructor({ email, phoneNumber, userName, src, about, messages }) {
        super(email, phoneNumber, userName, src, about);
        if (!(messages instanceof Array))
            throw TypeError(
                "Property 'messages' of class 'Contact' must be an 'Array'!"
            );
        this.messages = messages;
    }
}

""" 'frontend' message: 
    text,
    timeStamp: unix time in miliseconds acc to js,
    isSent: bool, which is true when the email in context is the sender,
    contact: the email of the person who is being spoken to
"""
""" 'backend' message:
    text,
    timeStamp: unix time in miliseconds acc to js,
    sender: email of the sender,
    recipient: email of the recipient
"""


def convert_for_frontend(
    email, message
):  # accepts a 'backend' message object and converts to a 'frontend' message object
    converted = {}
    converted["text"] = message["text"]
    converted["timeStamp"] = message["time_stamp"]
    converted["isSent"] = message["sender"] == email
    converted["contact"] = (
        message["recipient"] if message["sender"] == email else message["sender"]
    )
    return converted


def convert_for_backend(
    email, message
):  # accepts a 'frontend' message object and converts to a 'backend' message object
    converted = {}
    converted["text"] = message["text"]
    converted["time_stamp"] = message["timeStamp"]
    converted["sender"] = email if message["isSent"] else message["contact"]
    converted["recipient"] = message["contact"] if message["isSent"] else email
    return converted

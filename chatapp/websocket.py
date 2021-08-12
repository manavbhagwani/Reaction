import json
import jwt
from psycopg2.extras import execute_values
from asgiref.sync import sync_to_async
from .helper import convert_for_frontend, convert_for_backend


@sync_to_async
def write_messages(connection, buffer):  # write messages to db
    rows = []
    for key, value in buffer.items():
        if key == "count":
            continue
        for msg in value:
            if msg["sender"] == key:
                rows.append(
                    (
                        msg["sender"],
                        msg["recipient"],
                        msg["text"],
                        msg["time_stamp"],
                    )
                )
    print("ROWS: ", rows)
    with connection.cursor() as curs:
        res = execute_values(
            curs,
            "INSERT INTO api_message (sender, recipient, text, time_stamp) VALUES %s",
            rows,
        )
    connection.commit()
    buffer.clear()


@sync_to_async
def write_connection(connection, decoded):
    with connection.cursor() as curs:
        curs.execute(
            "SELECT COUNT(*) FROM api_connections WHERE (first=%s and second=%s) or (first=%s and second=%s);",
            (
                decoded["first"],
                decoded["second"],
                decoded["second"],
                decoded["first"],
            ),
        )
        if curs.fetchall()[0][0] == 0:  # TODO: add timeout in else cont.
            res = curs.execute(
                "INSERT INTO api_connections (first, second) VALUES (%s, %s);",
                (decoded["first"], decoded["second"]),
            )
            connection.commit()


async def websocket_application(
    scope, receive, send, buffer, latest, connection, current_pool
):

    while True:
        event = await receive()

        if event["type"] == "websocket.connect":
            await send({"type": "websocket.accept"})
            for header in scope["headers"]:
                if header[0].decode("utf-8") == "cookie":
                    token = (
                        header[1].decode("utf-8").split("=")[1]
                    )  # because in header[1] it is in the format 'token=....'
                    try:
                        decoded = jwt.decode(token, "some_secret", algorithms=["HS256"])
                        scope["token"] = token
                        scope["email"] = decoded["email"]
                        if scope["email"] in current_pool:
                            print("closing dual connection....")
                            await send({"type": "websocket.close", "code": 4000})
                            return
                        current_pool.add(decoded["email"])
                    except jwt.exceptions.InvalidTokenError:
                        await send({"type": "websocket.close", "code": 4001})
                        return
                    except:
                        await send({"type": "websocket.close", "code": 1011})
                        return
            if "token" not in scope:
                await send({"type": "websocket.close", "code": 4002})
                return

        if event["type"] == "websocket.disconnect":
            current_pool.remove(scope["email"])
            if scope["email"] in latest:
                latest.pop(scope["email"])
            break

        if event["type"] == "websocket.receive":
            if event["text"] == "ping":
                # TODO: clear user keys which aren't active for sometime or disconnected.
                messages = latest.get(scope["email"], [])
                if len(messages) > 0:
                    data = {}
                    data["type"] = "latest"
                    data["messages"] = [
                        convert_for_frontend(scope["email"], message)
                        for message in messages
                    ]
                    await send(
                        {
                            "type": "websocket.send",
                            "text": json.dumps(data),
                        }
                    )
                    latest[scope["email"]] = []
                try:
                    await send(
                        {
                            "type": "websocket.send",
                            "text": "pong",
                        }
                    )
                except:
                    print("caught")

            elif event["text"] == "get-all":
                latest[scope["email"]] = []
                messages = [
                    convert_for_frontend(scope["email"], message)
                    for message in buffer.get(scope["email"], [])
                ]
                data = {}
                data["type"] = "get-all"
                data["messages"] = messages
                print("get-all sent " + str(scope["client"]))
                await send({"type": "websocket.send", "text": json.dumps(data)})

            else:
                decoded = json.loads(event["text"])

                if decoded["type"] == "new-connection":
                    await write_connection(connection, decoded)

                elif decoded["type"] == "message":
                    message = convert_for_backend(scope["email"], decoded)
                    print(message)
                    message["text"] = message["text"].strip()
                    if (
                        len(message["text"]) == 0
                        or message["recipient"] == scope["email"]
                    ):
                        return
                    if message["recipient"] in buffer:
                        buffer[message["recipient"]].append(message)
                    else:
                        buffer[message["recipient"]] = [message]
                    if scope["email"] in buffer:
                        buffer[scope["email"]].append(message)
                    else:
                        buffer[scope["email"]] = [message]

                    if message["recipient"] in current_pool:
                        if message["recipient"] in latest:
                            latest[message["recipient"]].append(message)
                        else:
                            latest[message["recipient"]] = [message]
                    buffer["count"] = buffer.get("count", 0) + 1

                if buffer["count"] > 100:
                    await write_messages(connection, buffer)

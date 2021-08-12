from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from django.core import serializers
from django.db import connection
from django.db.models import Q
from .forms import UserForm, LoginForm, UploadFileForm
from .models import User, Connections, Message
from chatapp.helper import convert_for_frontend
from http import HTTPStatus
import jwt
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.core.files.storage import default_storage
import os
from dotenv import load_dotenv

load_dotenv()

URL = "http://" + os.environ["ip"] + ":8000/"


def get_jwt(email, phone_number):
    return jwt.encode(
        {"email": email, "phone_number": int(phone_number)},
        "some_secret",
        algorithm="HS256",
    )


def ImageURL(phone_number):
    src = "./frontend/dist/" + phone_number
    if os.path.isfile(src + ".png"):
        src = URL + phone_number + ".png"
    elif os.path.isfile(src + ".jpg"):
        src = URL + phone_number + ".jpg"
    elif os.path.isfile(src + ".jpeg"):
        src = URL + phone_number + ".jpeg"
    else:
        src = URL + "default.png"
    return src


@require_POST
def register(request):
    f = UserForm(request.POST)
    if f.is_valid():
        f.cleaned_data.pop("agreed_tnc")
        f.save()
        response = JsonResponse(
            {
                "email": f.cleaned_data["email"],
                "userName": f.cleaned_data["user_name"],
                "phoneNumber": f.cleaned_data["phone_number"],
                "src": URL + "default.png",
                "about": "Something about you :D",
            }
        )
        response.status_code = HTTPStatus.CREATED
        response.set_cookie(
            "token",
            value=get_jwt(
                f.cleaned_data.get("email"), f.cleaned_data.get("phone_number")
            ),
            samesite="Strict",
            httponly=True,
            max_age=30 * 24 * 60 * 60,
        )
        return response
    response = JsonResponse({"errors": f.errors})
    response.status_code = HTTPStatus.BAD_REQUEST
    return response


@require_POST
def login(request):
    f = LoginForm(request.POST)
    if f.is_valid():
        response = JsonResponse(
            {
                "email": f.cleaned_data["email"],
                "userName": f.cleaned_data["user_name"],
                "phoneNumber": f.cleaned_data["phone_number"],
                "src": URL + "default.png",
                "about": "Something about you :D",
            }
        )
        response.status_code = HTTPStatus.OK
        response.set_cookie(
            "token",
            value=get_jwt(
                f.cleaned_data.get("email"), f.cleaned_data.get("phone_number")
            ),
            samesite="Strict",
            httponly=True,
            max_age=30 * 24 * 60 * 60,
        )
        return response
    response = JsonResponse({"errors": f.errors})
    response.status_code = HTTPStatus.BAD_REQUEST
    return response


@require_http_methods(["GET", "POST"])
def user(request):
    if request.method == "GET":
        email = request.GET["email"]
        try:
            user = User.objects.get(email=email)
            response = JsonResponse(
                {
                    "email": user.email,
                    "userName": user.user_name,
                    "phoneNumber": user.phone_number,
                    "about": user.about,
                    "src": ImageURL(str(user.phone_number)),
                }
            )
            response.status_code = HTTPStatus.OK
        except User.DoesNotExist:
            response = JsonResponse({"errors": "User does not exist."})
            response.status_code = HTTPStatus.NOT_FOUND
        except:
            response = JsonResponse(
                {"errors": "Internal server error, sorry for the inconvenience."}
            )
            response.status_code = HTTPStatus.INTERNAL_SERVER_ERROR

        return response
    else:
        response = HttpResponse()
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            print(request.POST)
            try:
                user = User.objects.get(email=request.POST["email"])

                if "userName" in request.POST:
                    user.user_name = request.POST["userName"]

                if "about" in request.POST:
                    user.about = request.POST["about"]

                user.save()

                if "file" in request.FILES:
                    f = request.FILES["file"]
                    fileName = str(f)

                    image_url = ImageURL(str(request.POST["phone_number"]))

                    if image_url != URL + "default.png":
                        filePath = (
                            "./frontend/dist/" + image_url[image_url.rindex("/") + 1 :]
                        )
                        os.remove(filePath)

                    filePath = (
                        "./frontend/dist/"
                        + str(request.POST["phone_number"])
                        + fileName[fileName.rindex(".") :]
                    )

                    with default_storage.open(filePath, "wb") as destination:
                        for chunk in f.chunks():
                            destination.write(chunk)

                    response = JsonResponse(
                        {
                            "src": URL
                            + str(request.POST["phone_number"])
                            + fileName[fileName.rindex(".") :]
                        }
                    )

                response.status_code = HTTPStatus.ACCEPTED
            except:
                response.status_code = HTTPStatus.NOT_ACCEPTABLE

        return response


@require_GET
def messages(request):
    email = request.GET["email"]
    recipient = request.GET["recipient"]  # recipient email
    time_stamp = request.GET["time_stamp"]
    rows = Message.objects.order_by("-time_stamp").filter(
        Q(sender=email, recipient=recipient) | Q(sender=recipient, recipient=email),
        time_stamp__lt=time_stamp,
    )[:20]
    if len(rows) == 0:
        return HttpResponseNotFound()
    rows = [row for row in rows.values()]
    rows.reverse()
    messages = [convert_for_frontend(email, row) for row in rows]
    response = JsonResponse({"messages": messages})
    response.status_code = HTTPStatus.OK
    return response


@require_GET
def connections(request):
    email = request.GET["email"]
    # rows = Connections.objects.filter(Q(first=email) | Q(second=email))
    rows = []
    query = "SELECT DISTINCT ON (a.email) a.user_name, a.email, a.phone_number, a.about, m.sender, m.recipient, m.text, m.time_stamp  FROM (SELECT u.user_name, u.email, u.about, u.phone_number FROM api_connections c, api_user u WHERE (c.first = %s and u.email = c.second) or (c.second = %s and u.email = c.first)) a, api_message m WHERE (a.email = m.sender and  m.recipient = %s) or (a.email = m.recipient and m.sender = %s) ORDER BY a.email, m.time_stamp DESC;"
    with connection.cursor() as cur:
        cur.execute(query, (email, email, email, email))
        contacts = [
            {
                "userName": contact[0],
                "email": contact[1],
                "phoneNumber": int(contact[2]),
                "src": ImageURL(str(contact[2])),
                "about": contact[3],
                "messages": [
                    {
                        "text": contact[6],
                        "timeStamp": int(contact[7]),
                        "isSent": contact[4] == email,
                        "contact": contact[5] if contact[4] == email else contact[4],
                    }
                ],
            }
            for contact in cur.fetchall()
        ]
    response = JsonResponse({"contacts": contacts})
    response.status_code = HTTPStatus.OK
    return response


@require_GET
def logout(request):
    response = HttpResponse()
    response.delete_cookie("token")
    return response

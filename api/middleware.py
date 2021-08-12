import re
import json
import jwt
from django.http import HttpResponse
from http import HTTPStatus


class DecodeBody:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        if request.method == "POST" and request.path_info != "/api/user/":
            body_unicode = request.body.decode("utf-8")
            request.POST = json.loads(body_unicode)

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response


class Auth:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        # All GET api requests are protected by this.
        pattern = re.compile("/api/*/")
        valid_token = True
        if (request.method == "GET" and pattern.match(request.path_info)) or (
            request.method == "POST" and request.path_info == "/api/user/"
        ):
            if "token" in request.COOKIES:
                try:
                    decoded = jwt.decode(
                        request.COOKIES["token"], "some_secret", algorithms=["HS256"]
                    )
                    if request.method == "GET":
                        GET = request.GET.dict()
                        for key, value in GET.items():
                            decoded[key] = value
                        request.GET = decoded
                    else:
                        for key, value in request.POST.items():
                            decoded[key] = value
                        request.POST = decoded
                except jwt.exceptions.InvalidTokenError:
                    valid_token = False
                    print("INVALID TOKEN")
            else:
                valid_token = False
                print("TOKEN NOT PRESENT")

        if not valid_token:
            response = HttpResponse()
            response.status_code = HTTPStatus.UNAUTHORIZED
            return response

        response = self.get_response(request)
        # Code to be executed for each request/response after
        # the view is called.

        return response

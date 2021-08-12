from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register),
    path("login/", views.login),
    path("user/", views.user),
    path("connections/", views.connections),
    path("messages/", views.messages),
    path("logout/", views.logout),
]

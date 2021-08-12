from django.db import models


class User(models.Model):
    user_name = models.CharField(max_length=16)
    email = models.EmailField(primary_key=True)
    password = models.CharField(max_length=106)
    phone_number = models.DecimalField(max_digits=10, decimal_places=0, unique=True)
    about = models.TextField(max_length=300, default="Something about you :D")


class Message(models.Model):
    id = models.BigAutoField(primary_key=True)
    sender = models.EmailField()
    recipient = models.EmailField()
    text = models.TextField(max_length=500)
    time_stamp = models.BigIntegerField()

    class Meta:
        indexes = [
            models.Index(
                fields=["sender", "recipient", "-time_stamp"],
                name="message_index",
            )
        ]


class Connections(models.Model):
    id = models.BigAutoField(primary_key=True)
    first = models.EmailField()
    second = models.EmailField()

from django import forms
from django.forms import ValidationError
from .models import User
from hmac import compare_digest as compare_hash
from crypt import crypt


class UserForm(forms.ModelForm):
    agreed_tnc = forms.BooleanField()

    class Meta:
        model = User
        fields = ["user_name", "email", "password", "phone_number"]

    def clean_user_name(self):
        cleaned_username = self.cleaned_data.get("user_name")
        if cleaned_username.count(" ") > 0:
            raise ValidationError("White spaces are not allowed!")

        return cleaned_username

    def clean_email(self):
        cleaned_email = self.cleaned_data.get("email")
        try:
            existing_user = User.objects.get(email=cleaned_email)
            raise ValidationError("Email already in use!")
        except User.DoesNotExist:
            return cleaned_email

    def clean_phone_number(self):
        cleaned_phone_number = self.cleaned_data.get("phone_number")
        if len(str(cleaned_phone_number)) != 10:
            raise ValidationError("Phone number must be 10 digits!")
        try:
            existing_user = User.objects.get(phone_number=cleaned_phone_number)
            raise ValidationError("Phone number already in use!")
        except User.DoesNotExist:
            return cleaned_phone_number

    def clean_password(self):
        cleaned_password = self.cleaned_data.get("password")
        l = len(cleaned_password)
        if l < 8:
            raise ValidationError("Password length must be at least 8!")
        elif l > 32:
            raise ValidationError("Password length must be at most 32!")
        elif cleaned_password.count(" ") > 0:
            raise ValidationError("White spaces are not allowed!")

        return crypt(cleaned_password)


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField()

    def clean(self):
        cleaned_data = super().clean()
        cleaned_email = cleaned_data["email"]
        cleaned_password = cleaned_data["password"]
        if cleaned_password == None or cleaned_email == None:
            return cleaned_data
        elif len(cleaned_password) < 8 or len(cleaned_password) > 32:
            self.add_error("password", "Wrong email or password!")
            return cleaned_data
        try:
            existing_user = User.objects.get(email=cleaned_email)
            hashed = existing_user.password
            if not compare_hash(hashed, crypt(cleaned_password, hashed)):
                self.add_error("password", "Wrong email or password!")
            else:
                cleaned_data["user_name"] = existing_user.user_name
                cleaned_data["phone_number"] = existing_user.phone_number
        except User.DoesNotExist:
            self.add_error("password", "Wrong email or password!")

        return cleaned_data


class UploadFileForm(forms.Form):
    userName = forms.CharField(max_length=16, required=False)
    about = forms.CharField(max_length=300, required=False)
    file = forms.ImageField(required=False)

# Generated by Django 3.2.3 on 2021-07-08 16:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_auto_20210708_1630"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="image_name",
            field=models.CharField(default="default.png", max_length=15),
        ),
    ]

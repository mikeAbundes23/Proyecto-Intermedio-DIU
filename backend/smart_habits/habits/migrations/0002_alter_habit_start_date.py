# Generated by Django 5.1.1 on 2024-10-11 02:37

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('habits', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='habit',
            name='start_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
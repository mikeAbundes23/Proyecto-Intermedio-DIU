# Generated by Django 5.1.1 on 2024-10-11 03:10

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('habits', '0004_alter_habit_start_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='habit',
            name='start_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]

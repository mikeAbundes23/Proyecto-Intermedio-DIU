# Generated by Django 5.1.1 on 2024-10-11 03:08

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('habits', '0003_alter_habit_start_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='habit',
            name='start_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
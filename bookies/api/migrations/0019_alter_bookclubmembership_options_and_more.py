# Generated by Django 5.1.3 on 2024-12-17 20:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_alter_bookclub_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bookclubmembership',
            options={},
        ),
        migrations.AlterUniqueTogether(
            name='bookclubmembership',
            unique_together=set(),
        ),
    ]

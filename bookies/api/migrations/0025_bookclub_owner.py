# Generated by Django 5.1.3 on 2024-12-18 19:33

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

def set_default_owner(apps, schema_editor):
    User = apps.get_model('auth', 'User')  # Get the User model
    BookClub = apps.get_model('api', 'BookClub')  # Your BookClub model
    default_owner = User.objects.first()  # Set the default owner to the first user (adjust as needed)
    for club in BookClub.objects.filter(owner__isnull=True):  # Only set owner where it's null
        club.owner = default_owner
        club.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_posttag_rename_tag_clubtag_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='bookclub',
            name='owner',
            field=models.ForeignKey(
                on_delete=models.CASCADE,
                related_name='owned_clubs',
                to='auth.User',
                null=True
            ),
        ),
        migrations.RunPython(set_default_owner),
        migrations.AlterField(
            model_name='bookclub',
            name='owner',
            field=models.ForeignKey(
                on_delete=models.CASCADE,
                related_name='owned_clubs',
                to='auth.User',
                null=False
            ),
        ),
    ]

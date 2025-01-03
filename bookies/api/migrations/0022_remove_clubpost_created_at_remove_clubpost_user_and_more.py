# Generated by Django 5.1.3 on 2024-12-17 21:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_bookclub_clubpost'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='clubpost',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='clubpost',
            name='user',
        ),
        migrations.AlterField(
            model_name='clubpost',
            name='club',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='clubpost_posts', to='api.bookclub'),
        ),
        migrations.CreateModel(
            name='BookClubPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='club_posts', to=settings.AUTH_USER_MODEL)),
                ('club', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookclub_posts', to='api.bookclub')),
            ],
        ),
    ]

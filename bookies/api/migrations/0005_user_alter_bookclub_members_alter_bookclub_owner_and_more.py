# Generated by Django 5.1.3 on 2024-12-10 19:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_book'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=150, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=128)),
                ('first_name', models.CharField(blank=True, max_length=30)),
                ('last_name', models.CharField(blank=True, max_length=30)),
                ('user_type', models.CharField(choices=[('author', 'Author'), ('reader', 'Reader')], default='reader', max_length=10)),
                ('bio', models.TextField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AlterField(
            model_name='bookclub',
            name='members',
            field=models.ManyToManyField(related_name='book_clubs', through='api.BookClubMembership', to='api.user'),
        ),
        migrations.AlterField(
            model_name='bookclub',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owned_clubs', to='api.user'),
        ),
        migrations.AlterField(
            model_name='bookclubdiscussion',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='discussions', to='api.user'),
        ),
        migrations.AlterField(
            model_name='bookclubmembership',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='club_memberships', to='api.user'),
        ),
        migrations.AlterField(
            model_name='review',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.user'),
        ),
    ]
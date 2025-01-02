# Generated by Django 5.0.6 on 2024-12-21 20:43

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_merge_20241221_1606'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('book_id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('author', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('thumbnail', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='Bookshelf',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bookshelf_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('books', models.ManyToManyField(blank=True, related_name='bookshelves', to='api.book')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='bookshelf', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

# Generated by Django 5.1.3 on 2024-12-01 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_bookclub_bookclubdiscussion_bookclubmembership_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('author', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('category', models.CharField(max_length=255)),
            ],
        ),
    ]
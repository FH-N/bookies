# Generated by Django 5.1.3 on 2024-12-18 17:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_tag_bookclub_tags'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.RenameModel(
            old_name='Tag',
            new_name='ClubTag',
        ),
        migrations.RenameField(
            model_name='bookclub',
            old_name='tags',
            new_name='club_tags',
        ),
        migrations.AddField(
            model_name='bookclubpost',
            name='post_tags',
            field=models.ManyToManyField(blank=True, related_name='bookclub_posts', to='api.posttag'),
        ),
    ]

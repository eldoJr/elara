from django.core.management.base import BaseCommand
from djangoapp.populate import initiate


class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))
        initiate()
        self.stdout.write(self.style.SUCCESS('Database population completed successfully!'))
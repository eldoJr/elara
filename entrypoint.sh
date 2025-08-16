#!/bin/bash

# Wait for database to be ready (if using external DB)
echo "Waiting for database..."

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Create superuser if it doesn't exist
echo "Creating superuser..."
python manage.py shell << EOF
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@elara.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
EOF

# Populate initial data
echo "Populating initial data..."
python manage.py shell << EOF
from djangoapp.populate import initiate
try:
    initiate()
    print('Initial data populated')
except Exception as e:
    print(f'Data already exists or error: {e}')
EOF

# Start the server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
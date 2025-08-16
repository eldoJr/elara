#!/usr/bin/env python
"""
Database reset script for Elara E-commerce Platform
Removes existing database and recreates with fresh data
"""

import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')
django.setup()

from django.core.management import execute_from_command_line

def reset_database():
    """Reset the database completely"""
    print("🗑️  Removing existing database...")
    
    # Remove SQLite database file
    db_file = BASE_DIR / 'db.sqlite3'
    if db_file.exists():
        db_file.unlink()
        print("✅ Database file removed")
    
    print("🔄 Running migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    print("📊 Populating with initial data...")
    execute_from_command_line(['manage.py', 'populate_db'])
    
    print("🎉 Database reset complete!")
    print("\n📋 Available accounts:")
    print("   Admin: username=admin, password=admin123")
    print("   Demo:  username=demo, password=demo123")
    print("\n🚀 Start the server with: python manage.py runserver")

if __name__ == '__main__':
    reset_database()
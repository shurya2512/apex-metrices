import sys, os
from dotenv import load_dotenv
load_dotenv('backend/.env')
from sqlalchemy import create_engine, text

url = os.getenv('DATABASE_URL')
print("Connecting to:", url)
engine = create_engine(url)
try:
    with engine.connect() as conn:
        print('Checking tables...')
        tables = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")).fetchall()
        print('Tables found:', [t[0] for t in tables])
        if 'users' in [t[0] for t in tables]:
            users = conn.execute(text('SELECT count(*) FROM users;')).scalar()
            print('Users count:', users)
except Exception as e:
    print('Error:', e)

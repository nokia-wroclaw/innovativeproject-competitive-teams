from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from os import getenv

SQLALCHEMY_DATABASE_URL = getenv("DATABASE_URL")

# for dev environment with docker-compose
if SQLALCHEMY_DATABASE_URL == "":
    SQLALCHEMY_DATABASE_URL = "postgresql://admin:admin@db/ctdb"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

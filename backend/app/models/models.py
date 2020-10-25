from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    captain_id = Column(Integer, index=True, nullable=True)

    players = relationship("Player", back_populates="team")

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)

    team = relationship("Team", back_populates="players")
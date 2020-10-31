from sqlalchemy import Table, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base

class PlayerTeam(Base):
    __tablename__ = 'players_teams'

    player_id = Column('players_id', ForeignKey('players.id'), primary_key=True)
    team_id = Column('teams_id', ForeignKey('teams.id'), primary_key=True)

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)

    players = relationship("Player", secondary=PlayerTeam.__tablename__)

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, index=True)
    description = Column(String, index=True)

    teams = relationship("Team", secondary=PlayerTeam.__tablename__)

    
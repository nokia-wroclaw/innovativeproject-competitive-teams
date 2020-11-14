from sqlalchemy import Table, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base

class PlayerTeam(Base):
    __tablename__ = "players_teams"

    player_id = Column('players_id', ForeignKey('players.id'), primary_key=True)
    team_id = Column('teams_id', ForeignKey('teams.id'), primary_key=True)

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False, unique=True)
    description = Column(String)
    colour = Column(String, index=True)

    captain_id = Column(Integer, ForeignKey('players.id'))
    captain = relationship("Player", back_populates='captain_teams')


    players = relationship("Player", secondary=PlayerTeam.__tablename__)

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, index=True, unique=True)
    firebase_id = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, index=True)
    colour = Column(String, index=True)
    rank = Column(String, index=True)

    captain_teams = relationship("Team", back_populates='captain')
    teams = relationship("Team", secondary=PlayerTeam.__tablename__)

    
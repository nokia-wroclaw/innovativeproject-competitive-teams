from sqlalchemy import Table, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base

association_table = Table('association', Base.metadata,
    Column('teams_id', Integer, ForeignKey('teams.id')),
    Column('players_id', Integer, ForeignKey('players.id'))
)

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    captain_id = Column(Integer, ForeignKey("players.id"), index=True)
    captain = relationship("Player", back_populates="captain_teams")
    players = relationship(
        "Player",
        secondary=association_table,
        back_populates="teams"
    )

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)

    captain_teams = relationship("Team", back_populates="captain")
    teams = relationship(
        "Team",
        secondary=association_table,
        back_populates="players")

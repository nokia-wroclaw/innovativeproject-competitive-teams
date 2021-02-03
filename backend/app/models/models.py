from sqlalchemy import Table, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class PlayerTeam(Base):
    __tablename__ = "players_teams"

    player_id = Column("players_id", ForeignKey("players.id"), primary_key=True)
    team_id = Column("teams_id", ForeignKey("teams.id"), primary_key=True)


class TournamentTeam(Base):
    __tablename__ = "tournaments_teams"

    tournament_id = Column(
        "tournaments_id", ForeignKey("tournaments.id"), primary_key=True
    )
    team_id = Column("teams_id", ForeignKey("teams.id"), primary_key=True)


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False, unique=True)
    description = Column(String)
    colour = Column(String, index=True)

    captain_id = Column(Integer, ForeignKey("players.id"))
    captain = relationship("Player", back_populates="captain_teams")

    players = relationship("Player", secondary=PlayerTeam.__tablename__)
    tournaments = relationship("Tournament", secondary=TournamentTeam.__tablename__)


class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, index=True, unique=True)
    firebase_id = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, index=True)
    colour = Column(String, index=True)
    role = Column(String, index=True)

    captain_teams = relationship("Team", back_populates="captain")
    teams = relationship("Team", secondary=PlayerTeam.__tablename__)


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String)
    description = Column(String)

    team1_id = Column(Integer, ForeignKey("teams.id"))
    team1 = relationship("Team", uselist=False, foreign_keys=[team1_id])

    team2_id = Column(Integer, ForeignKey("teams.id"))
    team2 = relationship("Team", uselist=False, foreign_keys=[team2_id])

    start_time = Column(String)
    finished = Column(Boolean)

    tournament_place = Column(Integer)

    tournament_id = Column(Integer, ForeignKey("tournaments.id"))
    tournament = relationship("Tournament", back_populates="matches")

    score1 = Column(Integer)
    score2 = Column(Integer)


class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String)
    description = Column(String)

    start_time = Column(String)

    tournament_type = Column(String)
    swiss_rounds = Column(Integer)

    matches = relationship("Match", back_populates="tournament")
    teams = relationship("Team", secondary=TournamentTeam.__tablename__)

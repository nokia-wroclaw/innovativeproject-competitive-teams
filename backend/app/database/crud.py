from sqlalchemy.orm import Session

from app.models import models
from app.schemas import schemas

# Teams:

def get_team(db: Session, team_id: int):
    return db.query(models.Team).filter(models.Team.id == team_id).first() 

def get_team_by_name(db: Session, name: str):
    return db.query(models.Team).filter(models.Team.name == name).first()

def get_teams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Team).offset(skip).limit(limit).all()

def create_team(db: Session, team: schemas.TeamCreate):
    db_team = models.Team(name=team.name, description=team.description, colour=team.colour)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def delete_team(db: Session, team_id: int):
    to_remove = db.query(models.Team).filter(models.Team.id == team_id).first()
    db.delete(to_remove)
    db.commit()

# Players:

def get_player(db: Session, player_id: int):
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    return player

def get_player_by_name(db: Session, name: str):
    return db.query(models.Player).filter(models.Player.name == name).first()

def get_player_by_firebase_id(db: Session, firebase_id: str):
    return db.query(models.Player).filter(models.Player.firebase_id == firebase_id).first()

def get_players(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Player).offset(skip).limit(limit).all()

def create_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(name=player.name, description=player.description, 
    firebase_id=player.firebase_id, colour=player.colour)
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def delete_player(db: Session, player_id: int):
    to_remove = db.query(models.Player).filter(models.Player.id == player_id).first()
    db.delete(to_remove)
    db.commit()

# Team - Player functionality

def get_player_teams(db: Session, player_id: int, skip: int = 0, limit: int = 100):
    db_teams = db.query(models.Team).filter(models.Team.players.any(models.Player.id.in_([player_id]))).all()
    return db_teams

def get_player_captain_teams(db: Session, player_id: int, skip: int = 0, limit: int = 100):
    db_teams = db.query(models.Team).filter(models.Team.captain_id == player_id).all()
    return db_teams

def link_player_to_team_with_id(db: Session, team_id: int, player_id: int):
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    db_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    db_team.players.append(db_player)
    db.commit()

def is_player_in_team(db: Session, player_id: int, team_id: int):
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    db_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    return db_player in db_team.players

def set_team_captain(db:Session, player_id: int, team_id: int):
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    db_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    db_team.captain = db_player
    db.commit()

def link_player_to_team_with_name():
    pass

def unlink_player_to_team_with_id():
    pass

def unlink_player_to_team_with_name():
    pass

def link_captain_to_team_with_id():
    pass

def link_captain_to_team_with_name():
    pass

def unlink_captain_to_team_with_id():
    pass

def unlink_captain_to_team_with_name():
    pass
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
    db_team = models.Team(name=team.name, description=team.description)
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
    print(player)
    print(type(player))
    return player

def get_player_by_name(db: Session, name: str):
    return db.query(models.Player).filter(models.Player.name == name).first()

def get_players(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Player).offset(skip).limit(limit).all()

def create_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(**player.dict())
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def delete_player(db: Session, player_id: int):
    to_remove = db.query(models.Player).filter(models.Player.id == player_id).first()
    db.delete(to_remove)
    db.commit()

# Team - Player functionality

def link_player_to_team_with_id(db: Session, team_id: int, player_id: int):
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    db_team.players.append(db.query(models.Player).filter(models.Player.id == player_id).first())
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
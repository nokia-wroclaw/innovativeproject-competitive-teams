"""
    main.py
"""
from typing import List
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import crud
from app.models import models
from app.schemas import schemas
from app.database.database import SessionLocal, engine
from app.firebase import firebase

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Teams
@app.post("/api/teams/", response_model=schemas.Team)
def create_team(team: schemas.TeamCreate, db: Session = Depends(get_db)):
    return crud.create_team(db=db, team=team)

@app.delete("/api/teams/{team_id}")
def delete_team(team_id: int, db: Session = Depends(get_db)):
    if crud.get_team(db, team_id=team_id) is None:
        raise HTTPException(status_code=404, detail="Team not found")
    crud.delete_team(db, team_id)

@app.patch("/api/teams/{player_id}")
def update_team(team_id: int, team: schemas.TeamUpdate, db: Session = Depends(get_db)):
    if crud.get_team(db, team_id=team_id) is None:
        raise HTTPException(status_code=404, detail="Team not found")
    crud.update_team(db, team_id=team_id, team=team)

@app.get("/api/teams/{team_id}", response_model=schemas.Team)
def read_team(team_id: int, db: Session = Depends(get_db)):
    db_team = crud.get_team(db, team_id=team_id)
    if db_team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return db_team

@app.get("/api/teams/", response_model=List[schemas.Team])
def read_teams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    teams = crud.get_teams(db, skip=skip, limit=limit)
    return teams

# Players
@app.post("/api/players/", response_model=schemas.Player)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    db_player = crud.get_player_by_firebase_id(db, firebase_id=player.firebase_id)
    db_player_name = crud.get_player_by_name(db, name=player.name)
    if db_player is None and db_player_name is None:
        return crud.create_player(db=db, player=player)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Name already used")
    return db_player

@app.delete("/api/players/{player_id}")
def delete_player(player_id: int, db: Session = Depends(get_db)):
    if crud.get_player(db, player_id=player_id) is None:
        raise HTTPException(status_code=404, detail="Player not found")
    crud.delete_player(db, player_id)

@app.patch("/api/players/{player_id}")
def update_player(player_id: int, player: schemas.PlayerUpdate, db: Session = Depends(get_db)):
    if crud.get_player(db, player_id=player_id) is None:
        raise HTTPException(status_code=404, detail="Player not found")
    crud.update_player(db, player_id=player_id, player=player)

@app.get("/api/players/", response_model=List[schemas.Player])
def read_players(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    players = crud.get_players(db, skip=skip, limit=limit)
    return players

@app.get("/api/players/{player_id}", response_model=schemas.Player)
def read_player(player_id: int, db: Session = Depends(get_db)):
    db_player = crud.get_player(db, player_id=player_id)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@app.get("/api/players/firebase_id/{firebase_id}", response_model=schemas.Player)
def read_player_by_firebase_id(firebase_id: str, db: Session = Depends(get_db)):
    db_player = crud.get_player_by_firebase_id(db, firebase_id=firebase_id)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@app.get("/api/players/teams/{player_id}", response_model=List[schemas.Team])
def read_player_teams(player_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if crud.get_player(db, player_id=player_id) is None:
        raise HTTPException(status_code=404, detail="Player not found")
    db_teams = crud.get_player_teams(db, player_id=player_id, skip=skip, limit=limit)
    return db_teams

@app.get("/api/captain/teams/{player_id}", response_model=List[schemas.Team])
def read_player_captain_teams(player_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if crud.get_player(db, player_id=player_id) is None:
        raise HTTPException(status_code=404, detail="Player not found")
    db_teams = crud.get_player_captain_teams(db, player_id=player_id, skip=skip, limit=limit)
    return db_teams

# Team - Player operations
@app.put("/api/players/{team_id}")
def link_player_to_team(team_id: int, player_id: int, db: Session = Depends(get_db)):
    if crud.get_player(db, player_id=player_id) is None:
        raise HTTPException(status_code=404, detail="Player not found")
    if crud.get_team(db, team_id=team_id) is None:
        raise HTTPException(status_code=404, detail="Team not found")
    crud.link_player_to_team_with_id(db, team_id, player_id)

@app.put("/api/teams/{team_id}")
def set_team_captain(team_id: int, player_id: int, db: Session = Depends(get_db)):
    if crud.get_player(db, player_id=player_id) is None:
        raise HTTPException(status_code=404, detail="Player not found")
    if crud.get_team(db, team_id=team_id) is None:
        raise HTTPException(status_code=404, detail="Team not found")
    if not crud.is_player_in_team(db, player_id=player_id, team_id=team_id):
        raise HTTPException(status_code=404, detail="Player not in team")
    crud.set_team_captain(db, player_id=player_id, team_id=team_id)

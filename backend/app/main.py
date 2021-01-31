"""
    main.py
"""
from typing import List
from fastapi import Depends, FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import crud
from app.models import models
from app.schemas import schemas
from app.database.database import SessionLocal, engine
from app.firebase import firebase
from app.permissions import permissions

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
def create_team(
    team: schemas.TeamCreate,
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="admin"
    )
    if access:
        return crud.create_team(db=db, team=team)
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: admin"
        )


@app.delete("/api/teams/{team_id}")
def delete_team(
    team_id: int, firebase_id: str = Header(None), db: Session = Depends(get_db)
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="admin"
    )
    if access:
        if crud.get_team(db, team_id=team_id) is None:
            raise HTTPException(status_code=404, detail="Team not found")
        crud.delete_team(db, team_id)
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: admin"
        )


@app.patch("/api/teams/{player_id}")
def update_team(
    team_id: int,
    team: schemas.TeamUpdate,
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="admin"
    )
    if access:
        if crud.get_team(db, team_id=team_id) is None:
            raise HTTPException(status_code=404, detail="Team not found")
        crud.update_team(db, team_id=team_id, team=team)
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: admin"
        )


@app.get("/api/teams/{team_id}", response_model=schemas.Team)
def read_team(
    team_id: int, firebase_id: str = Header(None), db: Session = Depends(get_db)
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        db_team = crud.get_team(db, team_id=team_id)
        if db_team is None:
            raise HTTPException(status_code=404, detail="Team not found")
        return db_team
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/teams/", response_model=List[schemas.Team])
def read_teams(
    firebase_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        teams = crud.get_teams(db, skip=skip, limit=limit)
        return teams
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/teams_count/", response_model=int)
def count_teams(
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        count = crud.count_teams(db)
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/teams/search/", response_model=List[schemas.Team])
def search_teams(
    firebase_id: str = Header(None),
    name: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        teams = crud.search_teams_by_name(db, name=name, skip=skip, limit=limit)
        return teams
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/teams_count_by_search/", response_model=int)
def count_teams_by_search(
    firebase_id: str = Header(None),
    name: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        count = crud.count_teams_by_search(db, name)
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


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
def delete_player(
    player_id: int, firebase_id: str = Header(None), db: Session = Depends(get_db)
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="admin"
    )
    if access:
        if crud.get_player(db, player_id=player_id) is None:
            raise HTTPException(status_code=404, detail="Player not found")
        crud.delete_player(db, player_id)
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: admin"
        )


@app.patch("/api/players/{player_id}")
def update_player(
    player_id: int,
    player: schemas.PlayerUpdate,
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="admin"
    )
    if access:
        if crud.get_player(db, player_id=player_id) is None:
            raise HTTPException(status_code=404, detail="Player not found")
        player_check = crud.get_player_by_name(db, name=player.name)
        old_player = crud.get_player(db, player_id=player_id)
        if player_check is not None and old_player.name is not player_check.name:
            raise HTTPException(status_code=404, detail="Name already used")
        crud.update_player(db, player_id=player_id, player=player)
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: admin"
        )


@app.get("/api/players/", response_model=List[schemas.Player])
def read_players(
    firebase_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        players = crud.get_players(db, skip=skip, limit=limit)
        return players
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/players_count/", response_model=int)
def count_players(
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        count = crud.count_players(db)
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/players/search/", response_model=List[schemas.Player])
def search_players(
    firebase_id: str = Header(None),
    name: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        players = crud.search_players_by_name(db, name=name, skip=skip, limit=limit)
        return players
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/players_count_by_search/", response_model=int)
def count_players_by_search(
    firebase_id: str = Header(None),
    name: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        count = crud.count_players_by_search(db, name)
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/players/{player_id}", response_model=schemas.Player)
def read_player(
    player_id: int, firebase_id: str = Header(None), db: Session = Depends(get_db)
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        db_player = crud.get_player(db, player_id=player_id)
        if db_player is None:
            raise HTTPException(status_code=404, detail="Player not found")
        return db_player
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/players/firebase_id/{wanted_firebase_id}", response_model=schemas.Player)
def read_player_by_firebase_id(
    wanted_firebase_id: str,
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="player"
    )
    if access:
        db_player = crud.get_player_by_firebase_id(db, firebase_id=wanted_firebase_id)
        if db_player is None:
            raise HTTPException(status_code=404, detail="Player not found")
        return db_player
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: admin"
        )


@app.get("/api/players/teams/{player_id}", response_model=List[schemas.Team])
def read_player_teams(
    player_id: int,
    firebase_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        if crud.get_player(db, player_id=player_id) is None:
            raise HTTPException(status_code=404, detail="Player not found")
        db_teams = crud.get_player_teams(
            db, player_id=player_id, skip=skip, limit=limit
        )
        return db_teams
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/captain/teams/{player_id}", response_model=List[schemas.Team])
def read_player_captain_teams(
    player_id: int,
    firebase_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        if crud.get_player(db, player_id=player_id) is None:
            raise HTTPException(status_code=404, detail="Player not found")
        db_teams = crud.get_player_captain_teams(
            db, player_id=player_id, skip=skip, limit=limit
        )
        return db_teams
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


# Team - Player operations
@app.put("/api/players/{team_id}")
def link_player_to_team(
    team_id: int,
    player_id: int,
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="admin"
    )
    if access:
        if crud.get_player(db, player_id=player_id) is None:
            raise HTTPException(status_code=404, detail="Player not found")
        if crud.get_team(db, team_id=team_id) is None:
            raise HTTPException(status_code=404, detail="Team not found")
        if not crud.is_player_in_team(db, player_id=player_id, team_id=team_id):
            crud.link_player_to_team_with_id(db, team_id, player_id)
        else:
            raise HTTPException(status_code=404, detail="Player already in the team")
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: admin"
        )


@app.put("/api/unlink_player/{team_id}")
def unlink_player_to_team(
    team_id: int,
    player_id: int,
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="admin"
    )
    if access:
        if crud.get_player(db, player_id=player_id) is None:
            raise HTTPException(status_code=404, detail="Player not found")
        if crud.get_team(db, team_id=team_id) is None:
            raise HTTPException(status_code=404, detail="Team not found")
        if crud.is_player_in_team(db, player_id=player_id, team_id=team_id):
            crud.unlink_player_to_team_with_id(db, team_id, player_id)
        else:
            raise HTTPException(status_code=404, detail="Player is not in the team")
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: admin"
        )


@app.put("/api/teams/{team_id}")
def set_team_captain(
    team_id: int,
    player_id: int,
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="admin"
    )
    if access:
        if crud.get_player(db, player_id=player_id) is None:
            raise HTTPException(status_code=404, detail="Player not found")
        if crud.get_team(db, team_id=team_id) is None:
            raise HTTPException(status_code=404, detail="Team not found")
        if not crud.is_player_in_team(db, player_id=player_id, team_id=team_id):
            raise HTTPException(status_code=404, detail="Player not in team")
        crud.set_team_captain(db, player_id=player_id, team_id=team_id)
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: admin"
        )


# matches
@app.post("/api/matches/", response_model=schemas.Match)
def create_match(
    match: schemas.MatchCreate,
    team1_id: int = Header(None),
    team2_id: int = Header(None),
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="moderator"
    )
    if access:
        db_team1 = crud.get_team(db, team_id=team1_id)
        db_team2 = crud.get_team(db, team_id=team2_id)
        if db_team1 is None or db_team2 is None:
            raise HTTPException(status_code=404, detail="Team not found")
        db_match = crud.create_match(
            db=db, match=match, team1_id=team1_id, team2_id=team2_id
        )
        return db_match

    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: moderator"
        )


@app.get("/api/matches/", response_model=List[schemas.Match])
def read_matches(
    firebase_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        matches = crud.get_matches(db, skip=skip, limit=limit)
        return matches
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/matches_count/", response_model=int)
def count_matches(
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        count = crud.count_matches(db)
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/upcoming_matches/", response_model=List[schemas.Match])
def read_upcoming_matches(
    firebase_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        matches = crud.get_upcoming_matches(db, skip=skip, limit=limit)
        return matches
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get(
    "/api/personal_upcoming_matches/{player_id}", response_model=List[schemas.Match]
)
def read_upcoming_personal_matches(
    firebase_id: str = Header(None),
    player_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        player = crud.get_player(db=db, player_id=player_id)
        if player is None:
            raise HTTPException(status_code=404, detail="Player not found")
        matches = crud.get_personal_upcoming_matches(
            db, player_id=player_id, skip=skip, limit=limit
        )
        return matches
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get(
    "/api/count_personal_upcoming_matches/{player_id}", response_model=int
)
def count_upcoming_personal_matches(
    firebase_id: str = Header(None),
    player_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        player = crud.get_player(db=db, player_id=player_id)
        if player is None:
            raise HTTPException(status_code=404, detail="Player not found")
        count = crud.count_personal_upcoming_matches(
            db, player_id=player_id
        )
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get(
    "/api/personal_finished_matches/{player_id}", response_model=List[schemas.Match]
)
def read_finished_personal_matches(
    firebase_id: str = Header(None),
    player_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        player = crud.get_player(db=db, player_id=player_id)
        if player is None:
            raise HTTPException(status_code=404, detail="Player not found")
        matches = crud.get_personal_finished_matches(
            db, player_id=player_id, skip=skip, limit=limit
        )
        return matches
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get(
    "/api/count_personal_finished_matches/{player_id}", response_model=int
)
def count_finished_personal_matches(
    firebase_id: str = Header(None),
    player_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        player = crud.get_player(db=db, player_id=player_id)
        if player is None:
            raise HTTPException(status_code=404, detail="Player not found")
        count = crud.count_personal_finished_matches(
            db, player_id=player_id
        )
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/matches/search/", response_model=List[schemas.Match])
def search_matches(
    firebase_id: str = Header(None),
    name: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        matches = crud.search_matches_by_name(db, name=name, skip=skip, limit=limit)
        return matches
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/matches_count_by_search/", response_model=int)
def count_matches_by_search(
    firebase_id: str = Header(None),
    name: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        count = crud.count_matches_by_search(db, name)
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/matches/{match_id}", response_model=schemas.Match)
def read_match(
    match_id: int = Header(None),
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        db_match = crud.get_match(db, match_id=match_id)
        if db_match is None:
            raise HTTPException(status_code=404, detail="Match not found")
        return db_match
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.patch("/api/matches/{match_id}")
def update_match(
    match: schemas.MatchUpdate,
    match_id: int = None,
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="moderator"
    )
    if access:
        if crud.get_match(db, match_id=match_id) is None:
            raise HTTPException(status_code=404, detail="Match not found")
        crud.update_match(db, match_id=match_id, match=match)
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: moderator"
        )


# tournaments
@app.post("/api/tournaments/", response_model=schemas.Tournament)
def create_tournament(
    tournament: schemas.TournamentCreate,
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="moderator"
    )
    if access:
        if tournament.tournament_type not in [
            "round-robin",
            "swiss",
            "single-elimination",
        ]:
            raise HTTPException(status_code=404, detail="Tournament type unknown")
        teams_ids = tournament.teams_ids
        for team_id in teams_ids:
            check = crud.get_team(db, team_id)
            if check is None:
                raise HTTPException(
                    status_code=404, detail="Team " + str(team_id) + " not found"
                )
        if tournament.tournament_type == "swiss":
            if len(teams_ids) % 2:
                raise HTTPException(
                    status_code=404,
                    detail="Swiss tournament: requires even number of teams",
                )
            if len(teams_ids) < tournament.swiss_rounds + 1:
                raise HTTPException(
                    status_code=404,
                    detail="Swiss tournament: Not enough teams for "
                    + str(tournament.swiss_rounds)
                    + " number of rounds",
                )
            if tournament.swiss_rounds <= 0:
                raise HTTPException(
                    status_code=404,
                    detail="Swiss tournament: non-positive number of rounds",
                )
        elif tournament.tournament_type == "single-elimination":
            if len(teams_ids) not in [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]:
                raise HTTPException(
                    status_code=404,
                    detail="Single-elimination tournament: number of teams should be a power of 2",
                )
        return crud.create_tournament(db=db, tournament=tournament)
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: moderator"
        )


@app.get("/api/tournaments/", response_model=List[schemas.Tournament])
def read_tournaments(
    firebase_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        tournaments = crud.get_tournaments(db, skip=skip, limit=limit)
        return tournaments
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/tournaments_count/", response_model=int)
def count_tournaments(
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        count = crud.count_tournaments(db)
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/tournaments/search/", response_model=List[schemas.Tournament])
def search_tournaments(
    firebase_id: str = Header(None),
    name: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        tournaments = crud.search_tournaments_by_name(
            db, name=name, skip=skip, limit=limit
        )
        return tournaments
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/tournaments_count_by_search/", response_model=int)
def count_tournaments_by_search(
    firebase_id: str = Header(None),
    name: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        count = crud.count_tournaments_by_search(db, name)
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/tournaments/{tournament_id}", response_model=schemas.Tournament)
def read_tournament(
    tournament_id: int = Header(None),
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        db_tournament = crud.get_tournament(db, tournament_id=tournament_id)
        if db_tournament is None:
            raise HTTPException(status_code=404, detail="Tournament not found")
        return db_tournament
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


# Tournament - Matches


@app.patch("/api/tournaments/{tournament_id}/input_match_result")
def update_tournament_match(
    match: schemas.MatchResult,
    match_id: int = None,
    tournament_id: int = None,
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="moderator"
    )
    if access:
        db_tournament = crud.get_tournament(db, tournament_id=tournament_id)
        if crud.get_match(db, match_id=match_id) is None:
            raise HTTPException(status_code=404, detail="Match not found")
        if db_tournament is None:
            raise HTTPException(status_code=404, detail="Tournament not found")
        if not crud.is_match_in_tournament(
            db, tournament_id=tournament_id, match_id=match_id
        ):
            raise HTTPException(status_code=404, detail="Match not in tournament")
        if crud.is_match_empty(db, match_id=match_id):
            raise HTTPException(
                status_code=404, detail="Teams are not set in match yet"
            )
        if db_tournament.tournament_type == "single-elimination" and (
            match.score1 == match.score2
        ):
            raise HTTPException(
                status_code=404,
                detail="No ties allowed in single-elimination tournament",
            )
        crud.update_tournament_match(
            db, tournament_id=tournament_id, match_id=match_id, match=match
        )
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: moderator"
        )


@app.get("/api/tournament/{tournament_id}/matches", response_model=List[schemas.Match])
def read_tournament_matches(
    tournament_id: int = Header(None),
    firebase_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        if crud.get_tournament(db, tournament_id=tournament_id) is None:
            raise HTTPException(status_code=404, detail="Tournament not found")
        matches = crud.get_tournament_matches(
            db, tournament_id=tournament_id, skip=skip, limit=limit
        )
        return matches
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get("/api/tournament_matches_count/", response_model=int)
def count_tournament_matches(
    firebase_id: str = Header(None),
    tournament_id: int = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        tournament = crud.get_tournament(db, tournament_id=tournament_id)
        if tournament is None:
            raise HTTPException(status_code=404, detail="Tournament not found")
        count = crud.count_tournament_matches(db, tournament_id=tournament_id)
        return count
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get(
    "/api/tournament/{tournament_id}/finished_matches",
    response_model=List[schemas.Match],
)
def read_tournament_finished_matches(
    tournament_id: int = Header(None),
    firebase_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        if crud.get_tournament(db, tournament_id=tournament_id) is None:
            raise HTTPException(status_code=404, detail="Tournament not found")
        matches = crud.get_tournament_finished_matches(
            db, tournament_id=tournament_id, skip=skip, limit=limit
        )
        return matches
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get(
    "/api/tournament/{tournament_id}/unfinished_matches",
    response_model=List[schemas.Match],
)
def read_tournament_unfinished_matches(
    tournament_id: int = Header(None),
    firebase_id: str = Header(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        if crud.get_tournament(db, tournament_id=tournament_id) is None:
            raise HTTPException(status_code=404, detail="Tournament not found")
        matches = crud.get_tournament_unfinished_matches(
            db, tournament_id=tournament_id, skip=skip, limit=limit
        )
        return matches
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )


@app.get(
    "/api/tournament/{tournament_id}/scoreboard",
    response_model=schemas.TournamentResults,
)
def read_tournament_scoreboard(
    tournament_id: int = Header(None),
    firebase_id: str = Header(None),
    db: Session = Depends(get_db),
):
    access = permissions.is_accessible(
        db=db, firebase_id=firebase_id, clearance="guest"
    )
    if access:
        if crud.get_tournament(db, tournament_id=tournament_id) is None:
            raise HTTPException(status_code=404, detail="Tournament not found")
        return crud.get_tournament_scoreboard(db, tournament_id=tournament_id)
    else:
        raise HTTPException(
            status_code=404, detail="Permission denied, requires at least: player"
        )

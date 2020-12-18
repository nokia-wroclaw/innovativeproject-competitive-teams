from sqlalchemy.orm import Session
from datetime import datetime
import iso8601
import itertools
import random
import copy

from app.models import models
from app.schemas import schemas

# Teams:

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

def update_team(db: Session, team_id: int, team: schemas.TeamUpdate):
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    db_team.colour = team.colour
    db_team.description = team.description
    db.commit()

def get_team(db: Session, team_id: int):
    return db.query(models.Team).filter(models.Team.id == team_id).first() 

def get_team_by_name(db: Session, name: str):
    return db.query(models.Team).filter(models.Team.name == name).first()

def search_teams_by_name(db: Session, name: str, skip: int = 0, limit: int = 100):
    db_teams = db.query(models.Team).offset(skip).limit(limit).all()
    ans = []
    if name is None:
        name = ""
    for team in db_teams:
        if name.lower() in team.name.lower():
            ans.append(team)
    return ans

def get_teams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Team).offset(skip).limit(limit).all()

# Players:

def create_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(name=player.name, description=player.description, 
    firebase_id=player.firebase_id, colour=player.colour, role="admin")
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def delete_player(db: Session, player_id: int):
    to_remove = db.query(models.Player).filter(models.Player.id == player_id).first()
    db.delete(to_remove)
    db.commit()

def update_player(db: Session, player_id: int, player: schemas.PlayerUpdate):
    db_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    db_player.name = player.name
    db_player.colour = player.colour
    db_player.description = player.description
    db.commit()

def get_player(db: Session, player_id: int):
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    return player

def get_player_by_name(db: Session, name: str):
    return db.query(models.Player).filter(models.Player.name == name).first()

def get_player_by_firebase_id(db: Session, firebase_id: str):
    return db.query(models.Player).filter(models.Player.firebase_id == firebase_id).first()

def get_players(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Player).offset(skip).limit(limit).all()

def search_players_by_name(db: Session, name: str, skip: int = 0, limit: int = 100):
    db_players = db.query(models.Player).offset(skip).limit(limit).all()
    ans = []
    if name is None:
        name = ""
    for player in db_players:
        if name.lower() in player.name.lower():
            ans.append(player)
    return ans

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

# Matches

def create_match(db: Session, match: schemas.MatchCreate, team1_id: int, team2_id: int):
    db_match = models.Match(**match.dict(), team1_id=team1_id, team2_id=team2_id)
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

def get_matches(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Match).offset(skip).limit(limit).all()

def get_upcoming_matches(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Match).filter(models.Match.finished == False).order_by(models.Match.start_time).offset(skip).limit(limit).all()

def get_match(db: Session, match_id: int):
    return db.query(models.Match).filter(models.Match.id == match_id).first()

def update_match(db: Session, match_id: int, match: schemas.MatchUpdate):
    db_match = db.query(models.Match).filter(models.Match.id == match_id).first()
    db_match.name = match.name
    db_match.description = match.description
    db_match.start_time = match.start_time
    db_match.finished = match.finished
    db_match.score1 = match.score1
    db_match.score2 = match.score2
    db.commit()

# Tournaments

def create_tournament(db: Session, tournament: schemas.TournamentCreate):
    teams_ids = tournament.teams_ids
    db_tournament = models.Tournament(name=tournament.name, description=tournament.description, start_time=tournament.start_time,
    tournament_type=tournament.tournament_type, teams=[], swiss_rounds=tournament.swiss_rounds)
    for element in teams_ids:
        db_team = db.query(models.Team).filter(models.Team.id == element).first()
        db_tournament.teams.append(db_team)
    db.add(db_tournament)
    db.commit()
    db.refresh(db_tournament)
    if tournament.tournament_type == "round-robin":
        comb = list(itertools.combinations(teams_ids, 2))
        i = 0
        for t1, t2 in comb:
            i += 1
            db_match = models.Match(
                name = tournament.name + " match " + str(i),
                description = "",
                start_time = tournament.start_time,
                finished = False,
                score1 = 0,
                score2 = 0,
                team1_id = t1,
                team2_id = t2,
                tournament_place = i,
                tournament_id = db_tournament.id
            )
            db.add(db_match)
            db.commit()
            db.refresh(db_match)
    
    elif tournament.tournament_type == "swiss":
        lst = copy.deepcopy(teams_ids)

        def pop_random(lst):
            idx = random.randrange(0, len(lst))
            return lst.pop(idx)
        
        comb = []
        while lst:
            rand1 = pop_random(lst)
            rand2 = pop_random(lst)
            comb.append((rand1, rand2))
        i = 0
        for t1, t2 in comb:
            i += 1
            db_match = models.Match(
                name = tournament.name + " match " + str(i),
                description = "",
                start_time = tournament.start_time,
                finished = False,
                score1 = 0,
                score2 = 0,
                team1_id = t1,
                team2_id = t2,
                tournament_place = i,
                tournament_id = db_tournament.id
            )
            db.add(db_match)
            db.commit()
            db.refresh(db_match)

    return db_tournament

def update_tournament_match(db: Session, tournament_id: int, match_id: int, match: schemas.MatchResult):
    db_tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

    db_match = db.query(models.Match).filter(models.Match.id == match_id).first()
    db_match.score1 = match.score1
    db_match.score2 = match.score2
    db_match.finished = True
    db.commit()

    def is_pair_valid(pair):
        for match in db_tournament.matches:
            if (match.team1_id == pair[0] and match.team2_id == pair[1]) or (match.team1_id == pair[1] and match.team2_id == pair[0]):
                return False
        return True

    def is_perm_valid(perm):
        i = len(perm) - 1
        while i > 0:
            if not is_pair_valid((perm[i], perm[i - 1])):
                return False
            i -= 2
        return True

    def make_new_round(teams_ids):
        comb = []
        permutations = list(itertools.permutations(teams_ids))
        for perm in permutations:
            comb = []
            if is_perm_valid(perm):
                for i in range(0, len(teams_ids), 2):
                    comb.append((perm[i], perm[i + 1]))
                return comb
        print("MAKE NEW ROUND ERROR")

    if db_tournament.tournament_type == "swiss":
        scoreboard = get_tournament_scoreboard(db=db, tournament_id=tournament_id)
        if scoreboard.matches_unfinished == 0 and scoreboard.swiss_round < db_tournament.swiss_rounds:
            teams_ids = [result.team.id for result in scoreboard.results]
            comb = make_new_round(teams_ids)
            i = scoreboard.matches_finished
            for t1, t2 in comb:
                i += 1
                db_match = models.Match(
                    name = db_tournament.name + " match " + str(i),
                    description = "",
                    start_time = db_tournament.start_time,
                    finished = False,
                    score1 = 0,
                    score2 = 0,
                    team1_id = t1,
                    team2_id = t2,
                    tournament_place = i,
                    tournament_id = db_tournament.id
                )
                db.add(db_match)
                db.commit()
                db.refresh(db_match)

def get_tournament_matches(db: Session, tournament_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Match).filter(models.Match.tournament_id == tournament_id).order_by(models.Match.tournament_place).offset(skip).limit(limit).all()

def get_tournament_finished_matches(db: Session, tournament_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Match).filter(models.Match.tournament_id == tournament_id).filter(models.Match.finished).order_by(models.Match.tournament_place).offset(skip).limit(limit).all()

def get_tournament_unfinished_matches(db: Session, tournament_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Match).filter(models.Match.tournament_id == tournament_id).filter(models.Match.finished == False).order_by(models.Match.tournament_place).offset(skip).limit(limit).all()

def get_tournament_scoreboard(db: Session, tournament_id: int):
    
    def aux(team, score1, score2):
        if team == 1:
            if score1 == score2:
                return 0.5, score1
            if score1 > score2:
                return 1, score1
            return 0, score1
        if team == 2:
            if score1 == score2:
                return 0.5, score2
            if score1 > score2:
                return 0, score2
            return 1, score2

    db_tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()
    dic = {}
    matches_total = 0
    matches_finished = 0
    matches_unfinished = 0
    for team in db_tournament.teams:
        dic[team.id] = 0.0, 0
    for match in db_tournament.matches:
        matches_total += 1
        if match.finished == True:
            matches_finished += 1
            TP, MP = dic[match.team1_id]
            nTP, nMP = aux(1, match.score1, match.score2)
            dic[match.team1_id] = TP + nTP, MP + nMP

            TP, MP = dic[match.team2_id]
            nTP, nMP = aux(2, match.score1, match.score2)
            dic[match.team2_id] = TP + nTP, MP + nMP
        else:
            matches_unfinished += 1

    ndic = {k: v for k, v in sorted(dic.items(), key=lambda item: - (item[1][0] * 10000 + item[1][1]))}
    teams_results = []
    for team_id, val in ndic.items():
        team_result = schemas.TeamResults(
            team=db.query(models.Team).filter(models.Team.id == team_id).first(),
            tournament_points=val[0],
            match_points=val[1]
        )
        teams_results.append(team_result)

    swiss_round = None
    if db_tournament.tournament_type == "swiss":
        swiss_round = len(db_tournament.matches) / (len(db_tournament.teams) / 2)

    res = schemas.TournamentResults(matches_finished=matches_finished, 
                                    matches_unfinished = matches_unfinished, 
                                    matches_total = matches_total,
                                    swiss_round = swiss_round,
                                    finished = matches_total == matches_finished,
                                    results=teams_results)
    return res
    


def is_match_in_tournament(db: Session, tournament_id: int, match_id: int):
    db_tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()
    db_match = db.query(models.Match).filter(models.Match.id == match_id).first()
    return db_match in db_tournament.matches

def get_tournaments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Tournament).offset(skip).limit(limit).all()

def get_tournament(db: Session, tournament_id: int):
    return db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

# TODO
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
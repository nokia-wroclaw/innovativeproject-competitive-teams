from typing import ForwardRef, List, Optional
from pydantic import BaseModel

class PlayerBase(BaseModel):
    name: str
    description: Optional[str] = None
    colour: Optional[str] = None

class PlayerUpdate(BaseModel):
    description: Optional[str] = None
    colour: Optional[str] = None

class PlayerCreate(PlayerBase):
    firebase_id: str

class Player(PlayerBase):
    id: int
    role: Optional[str] = None
    
    class Config:
        orm_mode = True

class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    colour: Optional[str] = None

class TeamUpdate(BaseModel):
    description: Optional[str] = None
    colour: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    captain_id: Optional[int] = None
    players: List[Player] = []

    class Config:
        orm_mode = True

class MatchBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[str] = None
    finished: Optional[bool] = False
    score1: Optional[int] = 0
    score2: Optional[int] = 0
    
class MatchUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[str] = None
    finished: Optional[bool] = False
    score1: Optional[int] = 0
    score2: Optional[int] = 0


class MatchCreate(MatchBase):
    pass

class Match(MatchBase):
    id: int
    
    team1_id: Optional[int] = None
    team2_id: Optional[int] = None

    team1: Team
    team2: Team

    class Config:
        orm_mode = True

Player.update_forward_refs()
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
    rank: Optional[str] = None
    
    class Config:
        orm_mode = True

class TeamBase(BaseModel):
    name: str
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

Player.update_forward_refs()
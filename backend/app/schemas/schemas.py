from typing import List, Optional
from pydantic import BaseModel

class PlayerBase(BaseModel):
    name: str
    description: Optional[str] = None

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int
    team_id: Optional[int] = None

    class Config:
        orm_mode = True

class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    captain_id: Optional[int] = None
    players: List[Player] = []

    class Config:
        orm_mode = True

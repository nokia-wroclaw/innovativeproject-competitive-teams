from typing import ForwardRef, List, Optional
from pydantic import BaseModel

class PlayerBase(BaseModel):
    name: str
    description: Optional[str] = None

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int
    # teams_id: List[Integer] = []

    class Config:
        orm_mode = True

class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    players: List[Player] = []

    class Config:
        orm_mode = True

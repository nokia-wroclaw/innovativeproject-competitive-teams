from typing import ForwardRef, List, Optional
from pydantic import BaseModel

class PlayerBase(BaseModel):
    name: str
    description: Optional[str] = None

class PlayerCreate(PlayerBase):
    pass

List_of_teams = ForwardRef("List[Team]")

class Player(PlayerBase):
    id: int
    captain_teams: List_of_teams = []
    teams: List_of_teams = []

    class Config:
        orm_mode = True

class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    captain: Optional[Player] = None
    players: List[Player] = []

    class Config:
        orm_mode = True

Player.update_forward_refs()
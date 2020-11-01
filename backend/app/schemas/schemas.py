from typing import ForwardRef, List, Optional
from pydantic import BaseModel

class PlayerBase(BaseModel):
    name: str
    description: Optional[str] = None

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int
    
    # teams_id: List[int]
    # captain_teams = List[int]

    class Config:
        orm_mode = True

'''
class PlayerInfo(PlayerBase):
    id: int
    teams: "List[TeamBase]"
'''
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

Player.update_forward_refs()
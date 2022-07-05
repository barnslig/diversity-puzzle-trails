from pydantic import BaseModel
from pydantic.generics import GenericModel
from typing import Optional, Literal, Generic, TypeVar

TypeT = TypeVar("TypeT")
AttributesT = TypeVar("AttributesT")


class Data(GenericModel, Generic[TypeT, AttributesT]):
    type: TypeT
    id: Optional[str]
    attributes: AttributesT


DataT = TypeVar("DataT", bound=Data)


class Document(GenericModel, Generic[DataT]):
    data: DataT


class ClockAttributes(BaseModel):
    state: Literal["running", "paused"]
    speed: Optional[float]


ClockData = Data[Literal["clock"], ClockAttributes]
ClockData.__name__ = "ClockData"

ClockSchema = Document[ClockData]
ClockSchema.__name__ = "Clock"


class GameAttributes(BaseModel):
    hasMessages: Optional[bool]
    hasUserParameterScope: Optional[bool]


GameData = Data[Literal["game"], GameAttributes]
GameData.__name__ = "GameData"

GameSchema = Document[GameData]
GameSchema.__name__ = "Game"


class PlayerAttributes(BaseModel):
    name: Optional[str]
    character: Optional[str]


PlayerData = Data[Literal["player"], PlayerAttributes]
PlayerData.__name__ = "PlayerData"

PlayerSchema = Document[PlayerData]
PlayerSchema.__name__ = "Player"

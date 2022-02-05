from pydantic import BaseModel
from pydantic.generics import GenericModel
from typing import Optional, Literal, Generic, TypeVar

TypeT = TypeVar("TypeT")
AttributesT = TypeVar("AttributesT")


class Data(GenericModel, Generic[TypeT, AttributesT]):
    type: TypeT
    id: Optional[str]
    attributes: AttributesT


class Document(GenericModel, Generic[TypeT, AttributesT]):
    data: Data[TypeT, AttributesT]


class ClockAttributes(BaseModel):
    state: Literal["running", "paused"]
    speed: Optional[float]


ClockSchema = Document[Literal["clock"], ClockAttributes]
ClockSchema.__name__ = "Clock"


class GameAttributes(BaseModel):
    hasMessages: Optional[bool]
    hasUserParameterScope: Optional[bool]


GameSchema = Document[Literal["game"], GameAttributes]
GameSchema.__name__ = "Game"


class PlayerAttributes(BaseModel):
    name: Optional[str]
    character: Optional[str]


PlayerSchema = Document[Literal["player"], PlayerAttributes]
PlayerSchema.__name__ = "Player"

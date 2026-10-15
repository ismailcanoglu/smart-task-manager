
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator
)


class TaskCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=200
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        title = value.strip()

        if len(title) < 3:
            raise ValueError(
                "Görev başlığı en az 3 karakter olmalıdır."
            )

        return title


class TaskRead(BaseModel):
    id: int
    title: str
    completed: bool

    model_config = ConfigDict(
        from_attributes=True
    )

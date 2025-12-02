from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


# ---------- AUTH ----------
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- EXPENSE ----------
class ReceiptImageOut(BaseModel):
    id: int
    file_path: str

    class Config:
        from_attributes = True


class ExpenseBase(BaseModel):
    amount: float
    currency: str = "INR"
    category: Optional[str] = None
    description: Optional[str] = None
    ocr_text: Optional[str] = None
    spent_at: Optional[datetime] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseOut(ExpenseBase):
    id: int
    created_at: datetime
    receipt_images: List[ReceiptImageOut] = []

    class Config:
        from_attributes = True


# ---------- TRIP ----------
class TripBase(BaseModel):
    name: str
    purpose: Optional[str] = None
    travel_type: Optional[str] = None
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None
    status: Optional[str] = None


class TripCreate(TripBase):
    pass


class TripOut(TripBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- REPORT ----------
class ReportBase(BaseModel):
    report_name: str
    purpose: Optional[str] = None
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None
    status: Optional[str] = None
    trip_id: Optional[int] = None


class ReportCreate(ReportBase):
    pass


class ReportOut(ReportBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- TOKEN ----------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None

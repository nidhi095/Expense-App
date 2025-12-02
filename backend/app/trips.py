from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from . import models, schemas
from .auth import get_current_user
from .database import get_db

router = APIRouter(prefix="/trips", tags=["trips"])


@router.post("/", response_model=schemas.TripOut)
def create_trip(
    payload: schemas.TripCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    trip = models.Trip(
        user_id=current_user.id,
        name=payload.name,
        purpose=payload.purpose,
        travel_type=payload.travel_type,
        from_date=payload.from_date,
        to_date=payload.to_date,
        status=payload.status,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.get("/", response_model=List[schemas.TripOut])
def list_trips(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    trips = (
        db.query(models.Trip)
        .filter(models.Trip.user_id == current_user.id)
        .order_by(models.Trip.created_at.desc())
        .all()
    )
    return trips


@router.delete("/{trip_id}", status_code=204)
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    trip = (
        db.query(models.Trip)
        .filter(models.Trip.id == trip_id, models.Trip.user_id == current_user.id)
        .first()
    )
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    db.delete(trip)
    db.commit()
    return


@router.patch("/{trip_id}/status", response_model=schemas.TripOut)
def update_trip_status(
    trip_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    trip = (
        db.query(models.Trip)
        .filter(models.Trip.id == trip_id, models.Trip.user_id == current_user.id)
        .first()
    )
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    trip.status = status
    db.commit()
    db.refresh(trip)
    return trip

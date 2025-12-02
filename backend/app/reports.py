from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from . import models, schemas
from .auth import get_current_user
from .database import get_db

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/", response_model=schemas.ReportOut)
def create_report(
    payload: schemas.ReportCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if payload.trip_id is not None:
        trip = (
            db.query(models.Trip)
            .filter(models.Trip.id == payload.trip_id, models.Trip.user_id == current_user.id)
            .first()
        )
        if not trip:
            raise HTTPException(status_code=400, detail="Invalid trip_id")

    report = models.Report(
        user_id=current_user.id,
        trip_id=payload.trip_id,
        report_name=payload.report_name,
        purpose=payload.purpose,
        from_date=payload.from_date,
        to_date=payload.to_date,
        status=payload.status,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/", response_model=List[schemas.ReportOut])
def list_reports(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    reports = (
        db.query(models.Report)
        .filter(models.Report.user_id == current_user.id)
        .order_by(models.Report.created_at.desc())
        .all()
    )
    return reports


@router.delete("/{report_id}", status_code=204)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    report = (
        db.query(models.Report)
        .filter(models.Report.id == report_id, models.Report.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    db.delete(report)
    db.commit()
    return


@router.patch("/{report_id}/status", response_model=schemas.ReportOut)
def update_report_status(
    report_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    report = (
        db.query(models.Report)
        .filter(models.Report.id == report_id, models.Report.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = status
    db.commit()
    db.refresh(report)
    return report

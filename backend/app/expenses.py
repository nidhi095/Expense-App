import os
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from . import models, schemas
from .auth import get_current_user
from .database import get_db

router = APIRouter(prefix="/expenses", tags=["expenses"])

MEDIA_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), "media", "receipts")
os.makedirs(MEDIA_ROOT, exist_ok=True)


@router.post("/", response_model=schemas.ExpenseOut)
async def create_expense(
    amount: float = Form(...),
    currency: str = Form("INR"),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    ocr_text: Optional[str] = Form(None),
    spent_at: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    spent_dt = datetime.fromisoformat(spent_at) if spent_at else datetime.utcnow()

    expense = models.Expense(
        user_id=current_user.id,
        amount=amount,
        currency=currency,
        category=category,
        description=description,
        ocr_text=ocr_text,
        spent_at=spent_dt,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)

    if image is not None:
        filename = f"user{current_user.id}_exp{expense.id}_{int(datetime.utcnow().timestamp())}_{image.filename}"
        file_path = os.path.join(MEDIA_ROOT, filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await image.read())

        rel_path = f"receipts/{filename}"
        receipt = models.ReceiptImage(expense_id=expense.id, file_path=rel_path)
        db.add(receipt)
        db.commit()
        db.refresh(receipt)

        expense.receipt_images.append(receipt)

    return expense


@router.get("/", response_model=List[schemas.ExpenseOut])
def list_expenses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    expenses = (
        db.query(models.Expense)
        .filter(models.Expense.user_id == current_user.id)
        .order_by(models.Expense.spent_at.desc())
        .all()
    )
    return expenses


@router.get("/{expense_id}", response_model=schemas.ExpenseOut)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    expense = (
        db.query(models.Expense)
        .filter(models.Expense.id == expense_id, models.Expense.user_id == current_user.id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.put("/{expense_id}", response_model=schemas.ExpenseOut)
async def update_expense(
    expense_id: int,
    amount: float = Form(...),
    currency: str = Form("INR"),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    ocr_text: Optional[str] = Form(None),
    spent_at: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    expense = (
        db.query(models.Expense)
        .filter(models.Expense.id == expense_id, models.Expense.user_id == current_user.id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    expense.amount = amount
    expense.currency = currency
    expense.category = category
    expense.description = description
    expense.ocr_text = ocr_text
    if spent_at:
        expense.spent_at = datetime.fromisoformat(spent_at)

    if image is not None:
        filename = f"user{current_user.id}_exp{expense.id}_{int(datetime.utcnow().timestamp())}_{image.filename}"
        file_path = os.path.join(MEDIA_ROOT, filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await image.read())

        rel_path = f"receipts/{filename}"
        receipt = models.ReceiptImage(expense_id=expense.id, file_path=rel_path)
        db.add(receipt)

    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{expense_id}", status_code=204)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    expense = (
        db.query(models.Expense)
        .filter(models.Expense.id == expense_id, models.Expense.user_id == current_user.id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return


@router.get("/receipt/{image_id}")
def get_receipt_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    img = (
        db.query(models.ReceiptImage)
        .join(models.Expense)
        .filter(
            models.ReceiptImage.id == image_id,
            models.Expense.user_id == current_user.id,
        )
        .first()
    )
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")

    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "media", img.file_path)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File missing on server")

    return FileResponse(file_path)

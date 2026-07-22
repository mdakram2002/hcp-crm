from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_manager, get_db
from app.crud.interaction import get_dashboard_summary

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db), current_user=Depends(get_current_manager)):
    return get_dashboard_summary(db)

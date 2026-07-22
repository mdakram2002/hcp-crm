from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.crud.hcp import search_hcps
from app.models.hcp import HCP
from app.models.interaction import Interaction
from app.models.user import User

router = APIRouter(prefix="/api", tags=["hcps"])


@router.get("/hcps/search")
def search_hcp_endpoint(q: str = "", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = search_hcps(db, q)
    return [{"id": hcp.id, "name": hcp.name, "specialty": hcp.specialty, "institution": hcp.institution} for hcp in results]


@router.get("/hcps/{hcp_id}")
def get_hcp_profile(hcp_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    hcp = db.query(HCP).filter(HCP.id == hcp_id).first()
    if not hcp:
        raise HTTPException(status_code=404, detail="HCP not found")

    interactions = (
        db.query(Interaction)
        .filter(Interaction.hcp_id == hcp_id)
        .order_by(Interaction.date.desc(), Interaction.id.desc())
        .all()
    )
    return {
        "hcp": {
            "id": hcp.id,
            "name": hcp.name,
            "specialty": hcp.specialty,
            "institution": hcp.institution,
            "email": hcp.email,
            "phone": hcp.phone,
        },
        "interactions": [
            {
                "date": interaction.date,
                "sentiment": interaction.sentiment,
                "topics_discussed": interaction.topics_discussed,
                "outcomes": interaction.outcomes,
                "materials_shared": interaction.materials_shared or [],
                "samples_distributed": interaction.samples_distributed or [],
                "interaction_type": interaction.interaction_type,
            }
            for interaction in interactions
        ],
    }


@router.get("/hcps/{hcp_id}/sentiment-trend")
def get_hcp_sentiment_trend(hcp_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    hcp = db.query(HCP).filter(HCP.id == hcp_id).first()
    if not hcp:
        raise HTTPException(status_code=404, detail="HCP not found")

    interactions = (
        db.query(Interaction)
        .filter(Interaction.hcp_id == hcp_id)
        .order_by(Interaction.date.desc(), Interaction.id.desc())
        .all()
    )

    trend = []
    for interaction in interactions:
        if not interaction.date:
            continue
        sentiment_value = 0
        if interaction.sentiment == "Positive":
            sentiment_value = 1
        elif interaction.sentiment == "Negative":
            sentiment_value = -1
        trend.append({"date": interaction.date, "sentiment": sentiment_value})
    return trend

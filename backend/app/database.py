from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from .config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create tables and seed reference data if empty."""
    from . import models  # noqa: F401
    Base.metadata.create_all(bind=engine)

    from .models import Material
    db = SessionLocal()
    try:
        if db.query(Material).count() == 0:
            seed = [
                Material(name="OncoBoost Phase III PDF", item_type="material"),
                Material(name="OncoBoost Efficacy Brochure", item_type="material"),
                Material(name="CardioPlus Clinical Reprint", item_type="material"),
                Material(name="CardioPlus Safety Data Sheet", item_type="material"),
                Material(name="NeuroCalm Patient Leaflet", item_type="material"),
                Material(name="OncoBoost 50mg Sample Pack", item_type="sample"),
                Material(name="CardioPlus 10mg Sample Pack", item_type="sample"),
                Material(name="NeuroCalm Starter Sample", item_type="sample"),
            ]
            db.add_all(seed)
            db.commit()
    finally:
        db.close()

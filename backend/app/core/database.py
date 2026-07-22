from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

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
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))

    from app import models  # noqa: F401
    Base.metadata.create_all(bind=engine)

    from app.models.material import Material
    from app.models.user import User
    from app.models.hcp import HCP

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

        if db.query(User).count() == 0:
            from passlib.context import CryptContext

            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            db.add_all([
                User(email="rep@example.com", hashed_password=pwd_context.hash("rep123"), role="rep"),
                User(email="manager@example.com", hashed_password=pwd_context.hash("manager123"), role="manager"),
            ])
            db.commit()

        if db.query(HCP).count() == 0:
            seed_hcps = [
                HCP(name="Dr. Emily Carter", specialty="Oncology", institution="Northside Medical Center", phone="212-555-0101", email="ecarter@northside.org"),
                HCP(name="Dr. Marcus Lee", specialty="Cardiology", institution="Harborview Hospital", phone="212-555-0102", email="mlee@harborview.org"),
                HCP(name="Dr. Aisha Patel", specialty="Neurology", institution="Summit Health", phone="212-555-0103", email="apatel@summithealth.org"),
                HCP(name="Dr. Sofia Nguyen", specialty="Oncology", institution="Riverside Clinic", phone="212-555-0104", email="snguyen@riversideclinic.org"),
                HCP(name="Dr. Daniel Brooks", specialty="Immunology", institution="Lakeview Research Institute", phone="212-555-0105", email="dbrooks@lakeviewresearch.org"),
                HCP(name="Dr. Priya Sharma", specialty="Cardiology", institution="Metro General", phone="212-555-0106", email="psharma@metrogeneral.org"),
                HCP(name="Dr. Noah Kim", specialty="Neurology", institution="Cedar Care Center", phone="212-555-0107", email="nkim@cedarcare.org"),
                HCP(name="Dr. Jessica Alvarez", specialty="Oncology", institution="Pinecrest Hospital", phone="212-555-0108", email="jalvarez@pinecrest.org"),
            ]
            db.add_all(seed_hcps)
            db.commit()
    finally:
        db.close()

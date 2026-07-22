from sqlalchemy.orm import Session

from app.models.material import Material


def search_materials(db: Session, query: str, item_type: str | None = None):
    q = db.query(Material)
    if item_type:
        q = q.filter(Material.item_type == item_type)
    if query:
        q = q.filter(Material.name.ilike(f"%{query}%"))
    return q.all()

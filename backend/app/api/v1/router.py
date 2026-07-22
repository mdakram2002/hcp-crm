from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.chat import router as chat_router
from app.api.v1.endpoints.interactions import router as interactions_router
from app.api.v1.endpoints.hcps import router as hcps_router
from app.api.v1.endpoints.dashboard import router as dashboard_router

router = APIRouter(prefix="/api")
router.include_router(auth_router)
router.include_router(chat_router)
router.include_router(interactions_router)
router.include_router(hcps_router)
router.include_router(dashboard_router)

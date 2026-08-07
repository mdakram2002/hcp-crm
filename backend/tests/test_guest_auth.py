from app.api.v1.endpoints.auth import guest_login
from app.models.user import User


def test_guest_login_creates_guest_user_and_token(db_session):
    token = guest_login(db=db_session)

    assert token.access_token
    guest_user = db_session.query(User).filter(User.role == "guest").order_by(User.id.desc()).first()
    assert guest_user is not None
    assert guest_user.email.startswith("guest-")
    assert guest_user.role == "guest"

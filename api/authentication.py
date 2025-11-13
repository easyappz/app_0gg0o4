from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework import exceptions
from api.models import Member


def create_jwt_for_member(member: Member) -> str:
    payload = {
        'member_id': member.id,
        'exp': datetime.now(timezone.utc) + timedelta(seconds=getattr(settings, 'JWT_ACCESS_TTL_SECONDS', 86400)),
        'iat': datetime.now(timezone.utc),
        'typ': 'access',
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=getattr(settings, 'JWT_ALGORITHM', 'HS256'))
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token


def decode_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[getattr(settings, 'JWT_ALGORITHM', 'HS256')])
    except jwt.ExpiredSignatureError as e:
        raise exceptions.AuthenticationFailed('Токен истёк') from e
    except jwt.InvalidTokenError as e:
        raise exceptions.AuthenticationFailed('Неверный токен') from e


class JWTMemberAuthentication(BaseAuthentication):
    keyword = 'Bearer'

    def authenticate(self, request) -> Optional[Tuple[Member, str]]:
        auth = get_authorization_header(request).decode('utf-8')
        if not auth:
            return None
        parts = auth.split(' ')
        if len(parts) != 2 or parts[0] != self.keyword:
            raise exceptions.AuthenticationFailed('Неверный заголовок авторизации')
        token = parts[1]
        payload = decode_jwt(token)
        member_id = payload.get('member_id')
        if not member_id:
            raise exceptions.AuthenticationFailed('Неверный токен')
        try:
            member = Member.objects.get(id=member_id, is_active=True)
        except Member.DoesNotExist as e:
            raise exceptions.AuthenticationFailed('Пользователь не найден') from e
        return (member, token)

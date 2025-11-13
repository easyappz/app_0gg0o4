from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from .serializers import (
    MessageSerializer,
    MemberRegisterSerializer,
    MemberPublicSerializer,
    LoginSerializer,
)
from .authentication import create_jwt_for_member
from .permissions import IsAuthenticatedMember


class HelloView(APIView):
    """
    A simple API endpoint that returns a greeting message.
    """

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        ser = MemberRegisterSerializer(data=request.data)
        if ser.is_valid():
            member = ser.save()
            data = MemberPublicSerializer(member).data
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        ser = LoginSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        member = ser.validated_data['member']
        token = create_jwt_for_member(member)
        return Response({
            'access_token': token,
            'member': MemberPublicSerializer(member).data,
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticatedMember]

    def get(self, request):
        return Response(MemberPublicSerializer(request.user).data)

    def patch(self, request):
        from .serializers import MemberMeUpdateSerializer
        ser = MemberMeUpdateSerializer(request.user, data=request.data, partial=True)
        if ser.is_valid():
            ser.save()
            return Response(MemberPublicSerializer(request.user).data)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

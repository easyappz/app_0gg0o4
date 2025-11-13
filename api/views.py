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


from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from .models import Ad
from .serializers import AdSerializer, AdUpdateSerializer
from .permissions import IsAuthenticatedMember, IsOwnerOrReadOnly


class AdsListCreateView(generics.ListCreateAPIView):
    queryset = Ad.objects.select_related('owner').all()
    serializer_class = AdSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticatedMember()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if category:
            qs = qs.filter(category=category)
        if search:
            # simple icontains on title and description (no regex)
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))
        if min_price:
            try:
                qs = qs.filter(price__gte=float(min_price))
            except ValueError:
                pass
        if max_price:
            try:
                qs = qs.filter(price__lte=float(max_price))
            except ValueError:
                pass
        return qs

    def perform_create(self, serializer):
        serializer.save()


class AdRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ad.objects.select_related('owner').all()
    serializer_class = AdSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticatedMember(), IsOwnerOrReadOnly()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AdUpdateSerializer
        return AdSerializer


class MyAdsListView(generics.ListAPIView):
    serializer_class = AdSerializer
    permission_classes = [IsAuthenticatedMember]

    def get_queryset(self):
        return Ad.objects.select_related('owner').filter(owner=self.request.user)

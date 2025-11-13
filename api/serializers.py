from rest_framework import serializers
from .models import Member, Ad


class MemberPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ('id', 'username', 'email', 'phone', 'created_at')
        read_only_fields = fields


class MemberRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Member
        fields = ('username', 'email', 'phone', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        member = Member(**validated_data)
        member.set_password(password)
        member.save()
        return member


class MemberMeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ('username', 'phone')  # email stays read-only in this API
        extra_kwargs = {
            'username': {'required': False},
            'phone': {'required': False},
        }


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            member = Member.objects.get(email=email, is_active=True)
        except Member.DoesNotExist:
            raise serializers.ValidationError('Неверная почта или пароль')
        if not member.check_password(password):
            raise serializers.ValidationError('Неверная почта или пароль')
        attrs['member'] = member
        return attrs


class AdSerializer(serializers.ModelSerializer):
    owner = MemberPublicSerializer(read_only=True)

    class Meta:
        model = Ad
        fields = (
            'id', 'title', 'description', 'price', 'category', 'condition',
            'contact_email', 'contact_phone', 'owner', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

    def create(self, validated_data):
        request = self.context.get('request')
        owner = getattr(request, 'user', None)
        # Default contact info from owner if not provided
        if not validated_data.get('contact_email') and getattr(owner, 'email', None):
            validated_data['contact_email'] = owner.email
        if not validated_data.get('contact_phone') and getattr(owner, 'phone', None):
            validated_data['contact_phone'] = owner.phone
        return Ad.objects.create(owner=owner, **validated_data)


class AdUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = (
            'title', 'description', 'price', 'category', 'condition',
            'contact_email', 'contact_phone'
        )
        extra_kwargs = {f: {'required': False} for f in fields}

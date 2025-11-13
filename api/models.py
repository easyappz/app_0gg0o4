from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Member(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, blank=True)
    password = models.CharField(max_length=255)  # hashed
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password: str):
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.username} ({self.email})"


class Ad(models.Model):
    CATEGORY_CHOICES = [
        ('Автомобили', 'Автомобили'),
        ('Недвижимость', 'Недвижимость'),
    ]
    CONDITION_CHOICES = [
        ('новое', 'новое'),
        ('б/у', 'б/у'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    condition = models.CharField(max_length=8, choices=CONDITION_CHOICES)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=32, blank=True)

    owner = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='ads')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['price']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return self.title

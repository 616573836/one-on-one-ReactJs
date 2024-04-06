from django.db import models
from django.contrib.auth.models import User
from .meeting import Meeting


class PendingMember(models.Model):
    user = models.ForeignKey(User, related_name='pending_members', on_delete=models.CASCADE)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True)
    email = models.EmailField()
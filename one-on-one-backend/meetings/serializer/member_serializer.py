from rest_framework import serializers
from ..models import member


class MemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = member.Member
        fields = ['meeting', 'role','user','username']

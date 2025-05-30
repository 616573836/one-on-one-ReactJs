from rest_framework import serializers
from ..models.contact import Contact

class ContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contact
        fields = ['id', 'user1', 'user2',
                  'username1', 'username2',
                  'alias1', 'alias2',
                  'email1', 'email2', 'created'
                  ]


class ContactInfoSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()
    alias = serializers.SerializerMethodField()

    def __init__(self, contact, request_user):
        self.request_user = request_user
        super().__init__(contact)

    def get_user_id(self, obj):
        if self.request_user == obj.user1:
            return obj.user2.id
        else:
            return obj.user1.id

    def get_alias(self, obj):
        if self.request_user == obj.user1:
            return obj.alias2
        else:
            return obj.alias1

    def get_username(self, obj):
        if self.request_user == obj.user1:
            return obj.username2
        else:
            return obj.username1

    def get_email(self, obj):
        if self.request_user == obj.user1:
            return obj.email2
        else:
            return obj.email1
    class Meta:
        model = Contact
        fields = ['id', 'user_id', 'alias', 'username', 'email']

class ContactUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['alias1', 'alias2']
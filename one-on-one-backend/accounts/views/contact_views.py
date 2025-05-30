from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..serializer.contact_serializer import *
from django.db import models
from ..models.contact import Contact, get_contact
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
from datetime import datetime

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def contact_list_view(request):
    match request.method:
        case 'GET':
            user = request.user
            contacts_query = Contact.objects.filter(Q(user1=user) | Q(user2=user))
            filter_param = request.GET.get('filter', '').lower()

            if filter_param:
                contacts_query = contacts_query.filter(
                    Q(alias1__icontains=filter_param, user2=user) |
                    Q(alias2__icontains=filter_param, user1=user) |
                    Q(user1__username__icontains=filter_param, user2=user) |
                    Q(user2__username__icontains=filter_param, user1=user)
                )

            serializer = ContactSerializer(contacts_query, many=True)
            return Response(serializer.data)
        case 'POST':
            data = request.data.copy()

            user1 = request.user
            user2_id = data.get('user2')

            if str(user1.id) == str(user2_id):
                return Response({"error": "Cannot add yourself as contact."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user2 = User.objects.get(pk=user2_id)
            except User.DoesNotExist:
                return Response({"error": "User2 does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            if get_contact(user1, user2):
                return Response({"error": "Contact already exists."}, status=status.HTTP_400_BAD_REQUEST)
            today_str = datetime.now().strftime('%Y/%m/%d')
            data.update({
                'user1': user1.id,
                'username1': user1.username,
                'username2': user2.username,
                'alias1': user1.username,
                'alias2': user2.username,
                'email1': user1.email,
                'email2': user2.email,
                'created': today_str
            })
            serializer = ContactSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def contact_view(request, contact_id):
    contact = get_object_or_404(Contact, pk=contact_id)

    if request.user not in [contact.user1, contact.user2]:
        return Response({"error": "Permission Denied"}, status=status.HTTP_403_FORBIDDEN)

    match request.method:
        case "GET":
            serializer = ContactInfoSerializer(contact, request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        case "PUT":
            data = request.data.copy()
            data['id'] = contact_id
            if request.user == contact.user1:
                data['alias2'] = data.get('alias', '')
            elif request.user == contact.user2:
                data['alias1'] = data.get('alias', '')

            serializer = ContactUpdateSerializer(contact, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Contact info updated!'}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        case "DELETE":
            if contact:
                contact.delete()
                return Response({"message": "Contact deleted successfully."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Contact does not exist."}, status=status.HTTP_400_BAD_REQUEST)
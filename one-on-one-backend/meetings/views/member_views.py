from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Q
from ..models.meeting import Meeting
from ..models.node import JoinNode
from ..models.member import Member
from ..models.pre_member import PendingMember
from ..permissions import IsMember, is_member
from ..serializer.member_serializer import MemberSerializer
from accounts.models.contact import Contact
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.urls import reverse
from OneOnOne.settings import EMAIL_HOST_USER
from django.utils.http import urlsafe_base64_encode



@api_view(['GET'])
@permission_classes([IsMember | IsAdminUser])
def member_list_view(request, meeting_id):
    try:
        meeting = Meeting.objects.get(id=meeting_id)
    except:
        return Response({"error": "Meeting does not exist."}, status=status.HTTP_404_NOT_FOUND)

    if not is_member(request, meeting):
        return Response({"detail": "You do not have permission to perform this action."},
                        status=status.HTTP_403_FORBIDDEN)

    members = Member.objects.filter(meeting=meeting_id)
    if not members:
        return Response({"error": "Members does not exist."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data)


@api_view(['GET', 'PUT', 'DELETE', 'POST'])
@permission_classes([IsMember | IsAdminUser])
def member_view(request, meeting_id, user_id):

    try:
        meeting = Meeting.objects.get(id=meeting_id)
    except:
        return Response({"error": "Meeting does not exist."}, status=status.HTTP_404_NOT_FOUND)

    if not is_member(request, meeting):
        return Response({"detail": "You do not have permission to perform this action."},
                        status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        try:
            member = Member.objects.get(user=user_id, meeting=meeting_id)
        except:
            return Response({"error": "Member does not exist."}, status=status.HTTP_404_NOT_FOUND)

        try:
            serializer = MemberSerializer(member)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Member.DoesNotExist:
            return Response({"error": "Member is not in meeting."}, status=status.HTTP_404_NOT_FOUND)


    elif request.method == 'PUT':
        try:
            member = Member.objects.get(user=user_id, meeting=meeting_id)
        except:
            return Response({"error": "Member does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        if not Member.objects.filter(
            Q(role__iexact='host'), 
            meeting=meeting_id, 
            user=request.user
        ).exists():
            return Response(data={"detail": "You are not the host of the meeting."}, status=status.HTTP_403_FORBIDDEN)
        
        if (member.user == request.user or member.role.lower() == 'host') and request.data.get('role', '').lower() != 'host':
            return Response(data={"detail": "The host cannot change their own role to member."}, status=status.HTTP_400_BAD_REQUEST)
        
       
        serializer = MemberSerializer(member, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    elif request.method == 'DELETE':
        try:
            member = Member.objects.get(user=user_id, meeting=meeting_id)
        except:
            return Response({"error": "Member does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        if request.user == member.user:
            member.delete()
            if not Member.objects.filter(meeting=meeting).exists():
                meeting.delete()
                return Response({"message": "Member and meeting deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
            return Response({"message": "Delete success"}, status=status.HTTP_204_NO_CONTENT)


        if not Member.objects.filter(meeting=meeting_id, user=request.user, role__iexact='host').exists():
            return Response({"detail": "You are not allowed to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            member.delete()
            if not Member.objects.filter(meeting=meeting).exists():
                meeting.delete()
                return Response({"message": "Member and meeting deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
            return Response({"Delete success"}, status=status.HTTP_204_NO_CONTENT)
        except Member.DoesNotExist:
            return Response({"error": "Member is not in meeting."}, status=status.HTTP_404_NOT_FOUND)


    elif request.method == 'POST':
        user = request.user
        
        contact_exists = Contact.objects.filter(
            (Q(user1=user) & Q(user2_id=user_id)) | (Q(user1_id=user_id) & Q(user2=user))
        ).first()

        if contact_exists:
            token = get_random_string(64)
            
            confirmation_link = request.build_absolute_uri(reverse('meetings:confirm_member', args=[token]))
            # member = Member.objects.create(meeting_id=meeting_id, user_id=user_id)
            # serializer = MemberSerializer(member)
            # Determine the correct recipient based on the contact relationship
            recipient_user = contact_exists.user2 if contact_exists.user1 == user else contact_exists.user1
            PendingMember.objects.create(user_id=user_id, meeting_id=meeting_id, token=token, email=recipient_user.email)
            link = 'http://localhost:3000/meetings/'+ str(meeting_id) +'/members/' + str(recipient_user.id)
            send_mail(
                'Invitation from One on One',
                f'Please confirm your participation by following this link: {confirmation_link}',
                EMAIL_HOST_USER,
                [recipient_user.email],  # This is now dynamically set based on the contact relationship
                fail_silently=False,
            )

            # Optionally create JoinNode
            # JoinNode.objects.create(receiver_id=user_id, meeting_id=meeting_id, sender=user)
            
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Member is not in contact with the requesting user."},
                            status=status.HTTP_403_FORBIDDEN)


from rest_framework.decorators import api_view
from django.shortcuts import redirect
from ..models.pre_member import PendingMember
from ..models.member import Member
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from ..models.calendar import Calendar
from rest_framework.permissions import AllowAny
from ..models.meeting import Meeting

from .meeting_views import update_meeting_state


@api_view(['GET'])
@permission_classes([AllowAny])
def confirm_member(request, token):
    pending_member = PendingMember.objects.filter(token=token).first()
    if pending_member:
        meeting = Meeting.objects.get(pk=pending_member.meeting_id)

        if meeting.state == "approving" or meeting.state == "finalized":
            pending_member.delete()
            return Response({"error": "You cannot join the meeting."}, status=status.HTTP_400_BAD_REQUEST)
        Member.objects.create(user_id=pending_member.user_id, meeting_id=pending_member.meeting_id)
        Calendar.objects.create(meeting_id=pending_member.meeting_id, owner_id=pending_member.user_id)
        update_meeting_state(pending_member.meeting_id)
        pending_member.delete()
        return Response({"message": "Membership confirmed."}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid or expired confirmation token."}, status=status.HTTP_400_BAD_REQUEST)
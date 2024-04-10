from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.contrib.auth.models import User

from ..models.poll import Poll
from ..models.meeting import Meeting
from ..models.member import Member

from .meeting_views import get_available_time_intersection


@api_view(['POST'])
def pull_view(request, meeting_id, index):

    meeting = Meeting.objects.get(pk = meeting_id)

    if Poll.objects.filter(user=request.user, meeting=meeting).exists():
        return Response(data = {"error: You cannot re-poll"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "POST":
        Poll.objects.create(meeting = meeting, user = request.user, suggested_time_index = index)

        polls = Poll.objects.filter(meeting = meeting)

        if len(polls) == len(Member.objects.filter(meeting = meeting)):
            meeting.state = "finalized"
            meeting.save()

        return Response(data={"message": "Poll submitted successfully"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def fetch_decision(request, meeting_id):

    meeting = Meeting.objects.get(pk = meeting_id)

    polls = Poll.objects.filter(meeting = meeting)

    intersections = get_available_time_intersection(meeting_id)

    results = []
    for i in range(len(intersections)):
        results.append(0)

    for poll in polls:
        results[poll.suggested_time_index] += 1

    final = 0

    for i in range(len(results)):

        if results[i] > results[final]:
            final = i

    return Response(
        data = {
            "start_time": intersections[final][0],
            "end_time": intersections[final][1]
        },
        status = status.HTTP_200_OK
    )


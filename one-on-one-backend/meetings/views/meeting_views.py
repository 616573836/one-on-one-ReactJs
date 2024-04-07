from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from ..models.meeting import Meeting
from ..models.member import Member
from ..models.calendar import Calendar
from ..models.node import JoinNode
from ..models.event import Event
from ..serializer import meeting_serializer
from ..permissions import IsMember


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = meeting_serializer.MeetingSerializer

    def list(self, request, *args, **kwargs):
        self.check_permissions(request)

        current_user = request.user
        member_instances = Member.objects.filter(user=current_user)
        meetings = [member.meeting for member in member_instances]
        serializer = self.get_serializer(meetings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        self.check_permissions(request)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        Member.objects.create(meeting=serializer.instance, user=request.user, role='host')
        Calendar.objects.create(meeting=serializer.instance, owner=request.user)
        # Create a join node on user itself
        JoinNode.objects.create(receiver=request.user, meeting=serializer.instance, sender=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, url_path='<int:meeting_id>/', url_name='meeting-detail', methods=['GET', 'PUT', 'DELETE'])
    def detail(self, request, meeting_id=None):
        self.check_permissions(request)
        meeting = Meeting.objects.get(id=meeting_id)
        if request.method == 'GET':
            if meeting is None:
                return Response(data={"detail": "Meeting does not exist."}, status=status.HTTP_404_NOT_FOUND)
            serializer = meeting_serializer.MeetingSerializer(meeting, many=False)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            serializer = meeting_serializer.MeetingSerializer(instance=meeting, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_205_RESET_CONTENT)

        elif request.method == 'DELETE':
            if not Member.objects.filter(meeting=meeting, user=request.user, role=['host', 'Host']).exists():
                return Response(data={"detail": "You are not the host of the meeting."}, status=status.HTTP_403_FORBIDDEN)
            meeting.delete()
            return Response(data={"detail": "Meeting deleted."}, status=status.HTTP_204_NO_CONTENT)

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [IsAuthenticated]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'destroy':
            permission_classes = [IsMember | IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]


@api_view(['GET'])
def get_intersections(request, meeting_id=None):
    interaction =  get_available_time_intersection(meeting_id)

    data = {
        str(index): {"start time": start, "end time": end}
        for index, (start, end) in enumerate(interaction)
    }

    return Response(data=data)

def get_available_time_intersection(meeting_id):
    calendars_raw = Calendar.objects.filter(meeting_id=meeting_id).exclude(owner__isnull=True)

    calendars = []
    for index in range(len(calendars_raw)):
        calendar = calendars_raw[index]
        events = Event.objects.filter(calendar=calendar, availability="available").order_by(
            'start_time')
        calendars.append([])
        for event in events:
            calendars[index].append((event.start_time, event.end_time))

    curr_intersection = calendars[0]
    for calendar in calendars[1:]:
        curr_intersection = find_intersection(curr_intersection, calendar)
        if len(curr_intersection) == 0:
            return []

    return curr_intersection


def find_intersection(curr_inter, new_inter):
    if len(curr_inter) == 0 or len(new_inter) == 0:
        return []

    i, j = 0, 0
    intersection = []
    while i < len(curr_inter) and j < len(new_inter):

        start1, end1 = curr_inter[i]
        start2, end2 = new_inter[j]

        if start1 <= end2 and start2 <= end1:
            intersection.append((max(start1, start2), min(end1, end2)))

        if end1 < end2:
            i = i + 1
        else:
            j = j + 1

    return intersection
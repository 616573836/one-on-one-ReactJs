from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import meeting_views, calendar_views, member_views, node_views, event_views
from .views import pending_member_view
from .views import poll_views
app_name = 'meetings'

router = DefaultRouter()
router.register(r'', meeting_views.MeetingViewSet, basename='meeting')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:meeting_id>/interaction/', meeting_views.get_intersections, name="interaction"),
    path('<int:meeting_id>/start_poll/', meeting_views.start_poll_view, name="start_poll"),
    path('<int:meeting_id>/members/', member_views.member_list_view, name="member_list"),
    path('<int:meeting_id>/members/<int:user_id>/', member_views.member_view, name="member"),
    path('confirm_member/<str:token>/', pending_member_view.confirm_member, name="confirm_member"),

    path('<int:meeting_id>/calendars/', calendar_views.calendar_list_view, name="calendar-list"),
    path('<int:meeting_id>/members/<int:user_id>/calendar/', calendar_views.calendar_view, name="calendar"),

    path('<int:meeting_id>/members/<int:user_id>/calendar/events/', event_views.event_list_view, name="event-list"),
    path('<int:meeting_id>/members/<int:user_id>/calendar/events/<int:event_id>/', event_views.event_view, name="event"),

    path('<int:meeting_id>/nodes/', node_views.node_list_view, name="node-list"),
    path('<int:meeting_id>/nodes/<str:node_type>/', node_views.type_node_list_view, name="type-node-list"),
    path('<int:meeting_id>/nodes/<str:node_type>/<int:node_id>/', node_views.type_node_view, name="node"),

    path('<int:meeting_id>/poll/<int:index>/', poll_views.pull_view, name="submit-poll"),
    path('<int:meeting_id>/poll/', poll_views.fetch_poll, name="fetch-poll"),
    path('<int:meeting_id>/decision/', poll_views.fetch_decision, name="decision")
]

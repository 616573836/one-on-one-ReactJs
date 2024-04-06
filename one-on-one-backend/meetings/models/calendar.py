from django.db import models
from .meeting import Meeting
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.db import models
from datetime import datetime, timedelta


class Calendar(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, editable=False, null=True, blank=True)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, editable=False)
    created_time = models.DateTimeField(auto_now_add=True)
    modified_time = models.DateTimeField(auto_now=True)
    start_date = models.DateTimeField(default=datetime.now)
    end_date = models.DateTimeField()
    description = models.CharField(max_length=150, null=True)

    class Meta:
        ordering = ('id',)
        unique_together = ['meeting', 'owner']

    def __str__(self):
        return self.owner.__str__() + "'s calendar in " + self.meeting.__str__()
    
    def clean(self):
        # Check if the owner is associated with a member of the meeting
        if not self.meeting.member_set.filter(user=self.owner).exists():
            raise ValidationError("You must be a member of the meeting.")

    def save(self, *args, **kwargs):
        # If the start date is not provided, set it to the current date and time
        if not self.start_date:
            self.start_date = datetime.now()

        # If the end date is not provided, set it to a month later from the start date
        if not self.end_date:
            self.end_date = self.start_date + timedelta(days=30)

        super(Calendar, self).save(*args, **kwargs)

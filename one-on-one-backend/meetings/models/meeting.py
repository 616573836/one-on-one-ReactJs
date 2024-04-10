from django.db import models


class Meeting(models.Model):
    MeetingState = [
        ('edit', 'Edit State'),
        ('ready', 'Ready State'),
        ('approving', 'Approving State'),
        ('finalized', 'Finalized State'),
    ]

    id = models.AutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=120)
    description = models.CharField(max_length=120, null=True)
    state = models.CharField(choices=MeetingState, max_length=20, default='edit')
    created_time = models.DateTimeField(auto_now_add=True, null=True)
    modified_time = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ('id',)

    def __str__(self):
        return self.name

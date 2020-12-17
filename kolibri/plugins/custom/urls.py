from django.conf.urls import url

from .views import CustomView

urlpatterns = [url(r"^$", CustomView.as_view(), name="custom")]

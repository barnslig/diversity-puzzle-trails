from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:gameId>/clock', views.clock, name='clock'),
    path('<str:gameId>/parameters', views.parameter, name='clock'),
]

from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('games/<str:gameId>/clock', views.clock, name='clock'),
    path('games/<str:gameId>/parameters', views.parameter, name='parameter'),
    path('games/<str:gameId>/codes/<str:codeId>', views.code, name='code'),
]

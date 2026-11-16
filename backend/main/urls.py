"""
URL configuration for main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

#</Josiah 11/8/26
from . import views
#/Josiah 11/8/26>

urlpatterns = [
    path('admin/', admin.site.urls),
    # </Josiah 11/8/26
    path("", views.home, name="home"),

    path("login/", views.login_view, name="oidc_login"),
    # path("login/<str:provider>/", views.login_view, name="oidc_login"),
    path("oidc/callback/", views.callback, name="oidc_callback"),
    # path("callback/<str:provider>/", views.callback, name="oidc_callback"),

    path("logout/", views.logout_view, name="logout"),
    # /Josiah 11/8/26>
]

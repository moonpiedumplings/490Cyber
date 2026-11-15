# </Josiah 11/8/26
from authlib.integrations.django_client import OAuth
from django.conf import settings
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest, JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

oauth = OAuth()
oauth.register(
    name="oidc",
    server_metadata_url=f"{settings.OIDC_ISSUER}/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile", "code_challenge_method": "S256"},
)
# oauth.register(
#     name="google",
#     server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
#     client_kwargs={"scope": "openid email profile"},
# )


def login_view(request):
    redirect_uri = request.build_absolute_uri(reverse("oidc_callback"))
    return oauth.oidc.authorize_redirect(request, redirect_uri)

# def login_view(request, provider):
#     client = oauth.create_client(provider)
#     if not client:
#         raise Http404("Provider not found")
        
#     redirect_uri = request.build_absolute_uri(
#         reverse("oidc_callback", kwargs={"provider": provider})
#     )
#     return client.authorize_redirect(request, redirect_uri)

def callback(request):
    try:
        token = oauth.oidc.authorize_access_token(request)   # state, PKCE, ID token checks
    except Exception as exc:
        return HttpResponseBadRequest(f"login failed: {type(exc).__name__}")
    claims = token["userinfo"]                                # verified ID token claims
    User = get_user_model()
    user, _ = User.objects.get_or_create(
        username=f"oidc:{claims['sub']}", defaults={"email": claims.get("email", "")})
    login(request, user)                                      # rotates the session key
    return redirect("home")

# def callback(request, provider):
#     client = oauth.create_client(provider)
#     if not client:
#         raise Http404("Provider not found")
#     try:
#         token = client.authorize_access_token(request)
#     except Exception as exc:
#         return HttpResponseBadRequest(f"Login failed: {type(exc).__name__}")
#     claims = token.get("userinfo")
#     User = get_user_model()
#     user, _ = User.objects.get_or_create(
#         username=f"{provider}:{claims['sub']}", 
#         defaults={"email": claims.get("email", "")}
#     )
#     login(request, user)
#     return redirect("home")

def logout_view(request):
    logout(request)
    return redirect("/")

@login_required
def home(request):
    return JsonResponse({"user": request.user.username, "email": request.user.email})
# /Josiah 11/8/26>

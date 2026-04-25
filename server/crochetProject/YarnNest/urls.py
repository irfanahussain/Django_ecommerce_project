from django.urls import path
from YarnNest import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    
)

urlpatterns = [
    path('',views.getRoutes, name='getRoutes'),
    path('products/',views.getProducts,name="getProducts"),
    path('product/<str:pk>/',views.getProduct,name="getProduct"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/',views.getUserProfiles,name="getUserProfiles"),
    path('users/',views.getUsers,name="getUsers"),
    path('users/register/',views.registerUser,name="register"),
    path('activate/<uidb64>/<token>/',views.ActivateAccountView.as_view(),name='activate'),
    path('categories/',views.getCategories,name='categories'),
    path('orders/add/', views.addOrderItems, name='orders-add'),
    path('orders/myorders/', views.getMyOrders, name='myorders'),
    path('orders/pay/verify/', views.verifyPayment, name='verify-payment'),
    path('orders/<str:pk>/', views.getOrderById, name='user-order'),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid, name='order-pay'),
    path('orders/<str:pk>/deliver/', views.updateOrderToDelivered, name='order-deliver'),
    path('product/<str:pk>/reviews/', views.createProductReview, name='create-review'),
    
    
    
    



]

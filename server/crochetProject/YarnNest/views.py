from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from datetime import datetime

# from .products import products
from .models import Products
from .serializers import (
    CategorySerializer,
    ProductSerializers,
    UserSerializer,
    UserSerializerWithToken,
    OrderSerializer,
    MyTokenObtainPairSerializer
    )
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from .models import Category,Order,OrderItem,ShippingAddress,Review




#for sending mails and generate token
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from .utils import TokenGenerator,generate_token
from django.utils.encoding import force_bytes,force_str,DjangoUnicodeDecodeError
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View
import threading


class EmailThread(threading.Thread):
    def __init__(self, email_message):
        self.email_message = email_message
        threading.Thread.__init__(self)

    def run(self):
        self.email_message.send()

# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    return Response("hello irfana")


@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Products.objects.get(_id=pk)
        serializer = ProductSerializers(product, many=False)
        return Response(serializer.data)
    except (Products.DoesNotExist, ValueError):
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    data = request.data
    try:
        product = Products.objects.get(_id=pk)
        alreadyExists = product.review_set.filter(user=user).exists()
        if alreadyExists:
            return Response({'detail': 'Product already reviewed'},
                          status=status.HTTP_400_BAD_REQUEST)
        if data['rating'] == 0:
            return Response({'detail': 'Please select a rating'},
                          status=status.HTTP_400_BAD_REQUEST)
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        product.rating = sum(r.rating for r in reviews) / len(reviews)
        product.save()
        return Response({'detail': 'Review added successfully'})
    except Products.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer
    def validate(self, attrs):
        # Find user by email and replace username
        email = attrs.get('username')  # frontend sends email as username
        try:
            user = User.objects.get(email=email)
            attrs['username'] = user.username  # replace email with actual username
        except User.DoesNotExist:
            pass
        
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfiles(request):
    user=request.user
    serializer=UserSerializer(user,many=False)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    user=User.objects.all()
    serializer=UserSerializer(user,many=True)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data=request.data
    try:
        # user=User.objects.create(first_name=data['fname'],last_name=data['lname'],
        # username=data['email'],email=data['email'],password=make_password(data
        # ['password']))
        user=User.objects.create(first_name=data['fname'],last_name=data['lname'],
        username=data['email'],email=data['email'],password=make_password(data
        ['password']),is_active=True)

        # generate token for sending email
        email_subject="Active Your Account"
        message=render_to_string(
            "activate.html",
            {
            'user':user,
            'domain':'127.0.0.1:8000',
            'uid':urlsafe_base64_encode(force_bytes(user.pk)),
            'token':generate_token.make_token(user)
            }
        )
        # print(message)  
        email_message=EmailMessage(email_subject,message,settings.EMAIL_HOST_USER,[data['email']])  
        EmailThread(email_message).start()

        message={'details':'Activate your account please check click the link in gmail for account activation'}
        return Response(message)
        
    except Exception as e:
        message={'details':'User with this email already exist or something went wrong'}
        return Response(message)
    

class ActivateAccountView(View):
    def get(self, request, uidb64, token):
        try:            
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None        
        if user is not None and generate_token.check_token(user, token):
            user.is_active = True
            user.save()           
            return render(request, "activatesuccess.html")
        else:           
            return render(request, "activatefail.html")


@api_view(['GET'])
def getProducts(request):   
    query = request.query_params.get('keyword')   
    if query is None:
        query = ''  
    products = Products.objects.filter(productname__icontains=query)
    serializer = ProductSerializers(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True) 
    return Response(serializer.data) 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    try:
        # We use 'id' here because standard Django models (Order) use 'id'
        # unless you manually added '_id' to the Order class in models.py
        order = Order.objects.get(id=pk) 
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verifyPayment(request):
    data = request.data

    print("Payment Data:", data)

    return Response({'message': 'Payment verified successfully'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data.get('orderItems')

    # Add this safety check
    def clean_decimal(value):
        try:
            return float(value) if value != "NaN" else 0.0
        except (TypeError, ValueError):
            return 0.0

    try:
        if orderItems and len(orderItems) == 0:
            return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
        
        order = Order.objects.create(
            user=user,
            paymentMethod=data.get('paymentMethod'),
            shippingPrice=clean_decimal(data.get('shippingPrice')), 
            totalPrice=clean_decimal(data.get('totalPrice'))       
        )
        # 2. Create Shipping Address
        shipping = data.get('shippingAddress')
        ShippingAddress.objects.create(
            order=order,
            address=shipping.get('address'),
            city=shipping.get('city'),
            postalCode=shipping.get('postalCode'),
            # country=shipping.get('country'), # Check if you need country too
        )

        # 3. Create Order Items
    
        for i in orderItems:
            product = Products.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.productname,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url if product.image else ''
            )

            # 4. Update Stock
            product.stockcount -= int(i['qty'])
            product.save()
    
        

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

    except Exception as e:
        # This will print the error in your terminal and return it to the frontend
        print(f"Error: {e}")
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    try:
        order = Order.objects.get(id=pk)

        order.isPaid = True
        order.paidAt = datetime.now()
        # You can also save the razorpay_payment_id if you have a field for it
        order.razorpay_order_id = request.data.get('razorpay_order_id') 
        
        order.save()

        return Response('Order was paid')
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    try:
        order = Order.objects.get(id=pk)
        order.isDelivered = True
        order.deliveredAt = datetime.now()
        order.save()
        return Response('Order was delivered')
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)
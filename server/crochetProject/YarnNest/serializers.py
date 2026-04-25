from rest_framework import serializers
from .models import Products,Category,Order, OrderItem, ShippingAddress,Review
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ProductSerializers(serializers.ModelSerializer):
    category_name=serializers.CharField(source='category_instance.name',read_only=True)
    countInStock=serializers.IntegerField(source='stockcount',read_only=True)
    reviews = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Products
        fields='__all__'
    def get_reviews(self, obj): 
        reviews = obj.review_set.all()
        return ReviewSerializer(reviews, many=True).data


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'first_name']

    def get_name(self, obj):
        name = obj.first_name + ' ' + obj.last_name
        if name.strip() == '':
            name = obj.email[:5]
        return name

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token','first_name']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # attrs['username'] currently contains the email from the frontend
        email = attrs.get('username')
        
        try:
            # Find the user by email and replace the 'username' attribute
            # with the actual username (e.g., 'irfana')
            user = User.objects.get(email=email)
            attrs['username'] = user.username 
        except User.DoesNotExist:
            # If email doesn't exist, we let the super() call handle the 401
            pass

        # Call the original validate method with the corrected username
        data = super().validate(attrs)

        # Add your extra user info for the React frontend
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'





class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__' # Fixed: Double underscores

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__' 

class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user =serializers.SerializerMethodField(read_only=True)

    def get_user(self, obj): 
        user = obj.user
        return {
            'id': user.id,
            'first_name': user.first_name,
            'email': user.email,
        }

    
    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, order_instance):
        items = order_instance.orderitem_set.all() 
        return OrderItemSerializer(items, many=True).data

    def get_shippingAddress(self, order_instance):
        try:
            address = ShippingAddressSerializer(order_instance.shipping_address, many=False).data
        except Exception as e:
            print(f"Serializer Error: {e}")
            address = False
        return address
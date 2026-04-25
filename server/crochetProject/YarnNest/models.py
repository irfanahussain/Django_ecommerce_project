from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Category(models.Model):
    name=models.CharField(max_length=100)

    def __str__(self):
        return self.name
class Products(models.Model):
    category_instance=models.ForeignKey(Category,on_delete=models.CASCADE)
    productname = models.CharField(max_length=150)
    image = models.ImageField(null=True, blank=True)
    productinfo = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    numReviews=models.IntegerField(null=True,blank=True,default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    stockcount = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.productname
    
class Review(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return str(self.rating)






class Order(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    shippingPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    # Razorpay specific field
    razorpay_order_id = models.CharField(max_length=200, null=True, blank=True)
    
    

    def __str__(self):
        return str(self.createdAt)

class OrderItem(models.Model):
    product = models.ForeignKey(Products, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return str(self.name)

class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True, related_name='shipping_address')
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
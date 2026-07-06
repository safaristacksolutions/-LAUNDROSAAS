from rest_framework import serializers
from .models import ChurnPrediction, RevenueForecast


class ChurnPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurnPrediction
        fields = "__all__"


class RevenueForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueForecast
        fields = "__all__"

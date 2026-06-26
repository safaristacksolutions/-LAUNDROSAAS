import requests
import json
import base64
from datetime import datetime
from decouple import config


class MpesaGateway:
    def __init__(self, tenant=None):
        self.consumer_key = config("MPESA_CONSUMER_KEY")
        self.consumer_secret = config("MPESA_CONSUMER_SECRET")
        self.passkey = config("MPESA_PASSKEY")
        self.shortcode = config("MPESA_SHORTCODE", default="174379")
        self.env = config("MPESA_ENVIRONMENT", default="sandbox")
        self.base_url = "https://sandbox.safaricom.co.ke" if self.env == "sandbox" else "https://api.safaricom.co.ke"
        self.tenant = tenant

    def _get_token(self):
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        auth = base64.b64encode(
            f"{self.consumer_key}:{self.consumer_secret}".encode()
        ).decode()
        headers = {"Authorization": f"Basic {auth}"}
        response = requests.get(url, headers=headers)
        return response.json().get("access_token")

    def stk_push(self, phone, amount, account_ref, callback_url):
        token = self._get_token()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = base64.b64encode(
            f"{self.shortcode}{self.passkey}{timestamp}".encode()
        ).decode()

        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone,
            "PartyB": self.shortcode,
            "PhoneNumber": phone,
            "CallBackURL": callback_url,
            "AccountReference": account_ref,
            "TransactionDesc": "Laundry Payment",
        }

        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        response = requests.post(url, json=payload, headers=headers)
        return response.json()

    def query_status(self, checkout_request_id):
        token = self._get_token()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = base64.b64encode(
            f"{self.shortcode}{self.passkey}{timestamp}".encode()
        ).decode()

        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id,
        }

        url = f"{self.base_url}/mpesa/stkpushquery/v1/query"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        response = requests.post(url, json=payload, headers=headers)
        return response.json()

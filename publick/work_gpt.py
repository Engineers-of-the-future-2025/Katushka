import requests
import json

url = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"

payload = json.dumps({
  "model": "GigaChat-Pro",
  "messages": [
    {
      "role": "user",
      "content": "Что изображено на рисунке?",
      "attachments": [
        "d41a9a52-1918-4c53-9158-df96986737ac"
      ]
    }
  ],
  "stream": False,
  "update_interval": 0
})
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer access_token'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

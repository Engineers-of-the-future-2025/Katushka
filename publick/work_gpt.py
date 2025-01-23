import requests
import json

url = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"

payload = json.dumps({
  "model": "GigaChat",
  "messages": [
    {
      "role": "user",
      "content": "Привет! Как дела?"
    }
  ],
  "stream": False,
  "repetition_penalty": 1
})
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer <токен_доступа>'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

import requests
import json

url = 'http://codercba.com:1888/airbnb/api/home/hotrecommenddest'

response = requests.get(url)

if response.status_code == 200:
    data_json = json.loads(response.text)
    
    with open('hotrecommenddest.json', 'w', encoding='utf-8') as f: # 修改为 utf-8 编码方式
        json.dump(data_json, f, ensure_ascii=False)
        
    print('Data saved to hotrecommenddest.json file.')
else:
    print('Failed to get data from API.')

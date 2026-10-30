import os
import json
import urllib.request

output_dir = os.path.join(os.getcwd(), 'public', 'models')
os.makedirs(output_dir, exist_ok=True)

models = [
    'cpu.glb',
    'gpu.glb',
    'motherboard.glb',
    'ram.glb',
    'storage.glb',
    'monitor.glb'
]

base_url = 'https://raw.githubusercontent.com/masdeven/threejsvr2/main/assets/models/'

print(f"Downloading models into {output_dir}...")
for model in models:
    url = base_url + model
    dest = os.path.join(output_dir, model)
    print(f"Fetching {model} from {url}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(dest, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
            print(f"  -> Saved {model} ({len(data)} bytes)")
    except Exception as e:
        print(f"  -> Error downloading {model}: {e}")

print("Download step completed.")

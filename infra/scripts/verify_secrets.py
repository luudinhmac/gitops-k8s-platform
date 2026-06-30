import subprocess
import base64
import json
import os
def get_secret(namespace):
    try:
        out = subprocess.check_output(f'kubectl get secret portfolio-secrets -n {namespace} -o json', shell=True)
        data = json.loads(out.decode('utf-8'))
        jwt_encoded = data['data']['JWT_SECRET']
        return base64.b64decode(jwt_encoded).decode('utf-8')
    except Exception as e:
        return f"Error: {e}"
# Read expected keys
expected_prod = ""
expected_staging = ""
if os.path.exists("temp_keys.txt"):
    with open("temp_keys.txt", "r") as f:
        lines = f.readlines()
        for line in lines:
            if line.startswith("PROD:"):
                expected_prod = line.split(":", 1)[1].strip()
            elif line.startswith("STAGING:"):
                expected_staging = line.split(":", 1)[1].strip()
print("EXPECTED PROD:   ", expected_prod)
print("DECRYPTED PROD:  ", get_secret("blog-prod"))
print("EXPECTED STAGING:", expected_staging)
print("DECRYPTED STAGING:", get_secret("blog-staging"))
# Clean up temp keys file
if os.path.exists("temp_keys.txt"):
    os.remove("temp_keys.txt")
import secrets
import base64
import subprocess
import os
import shutil

def gen_key():
    return base64.b64encode(secrets.token_bytes(32)).decode('utf-8')

def find_kubeseal(infra_dir):
    # Try system PATH first
    path_bin = shutil.which("kubeseal")
    if path_bin:
        return path_bin
    
    # Try agent bin folder
    agent_bin_dir = os.path.join(infra_dir, "..", ".agent", "bin")
    for name in ["kubeseal.exe", "kubeseal"]:
        candidate = os.path.join(agent_bin_dir, name)
        if os.path.exists(candidate):
            return candidate
            
    # Try local directory
    if os.path.exists("kubeseal.exe"):
        return os.path.abspath("kubeseal.exe")
    if os.path.exists("kubeseal"):
        return os.path.abspath("kubeseal")
        
    return "kubeseal" # Fallback to default command name

def seal_value(kubeseal_path, value, name, namespace, cert_path):
    temp_file = "temp_secret_val.txt"
    with open(temp_file, "w", encoding="utf-8") as f:
        f.write(value)
        
    cmd = [
        kubeseal_path,
        "--raw",
        f"--from-file={temp_file}",
        "--cert", cert_path,
        "--name", name,
        "--namespace", namespace
    ]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = p.communicate()
    
    if os.path.exists(temp_file):
        os.remove(temp_file)
        
    if p.returncode != 0:
        raise Exception(f"kubeseal failed: {stderr.decode('utf-8')}")
    return stdout.decode('utf-8').strip()

def update_yaml_file(filepath, old_val_line_prefix, new_sealed_val):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    updated = False
    for i, line in enumerate(lines):
        if line.strip().startswith("JWT_SECRET:"):
            # Preserve the leading spaces/indentation
            indent = line[:line.find("JWT_SECRET:")]
            lines[i] = f'{indent}JWT_SECRET: "{new_sealed_val}"\n'
            updated = True
            break
            
    if not updated:
        raise Exception(f"JWT_SECRET line not found in {filepath}")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)

def main():
    # Resolve paths relative to script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    infra_dir = os.path.dirname(script_dir)
    
    cert_path = os.path.join(infra_dir, "sealed-cert.pem")
    prod_values_path = os.path.join(infra_dir, "environments", "production", "backend-values.yaml")
    staging_values_path = os.path.join(infra_dir, "environments", "staging", "backend-values.yaml")
    
    kubeseal_path = find_kubeseal(infra_dir)
    print(f"Using kubeseal binary: {kubeseal_path}")
    print(f"Using certificate: {cert_path}")
    print("-" * 50)
    
    prod_key = gen_key()
    staging_key = gen_key()
    
    print("Generated plaintext keys:")
    print(f"Production JWT_SECRET: {prod_key}")
    print(f"Staging JWT_SECRET:    {staging_key}")
    print("-" * 50)
    
    print("Encrypting keys with kubeseal...")
    prod_sealed = seal_value(kubeseal_path, prod_key, "portfolio-secrets", "blog-prod", cert_path)
    staging_sealed = seal_value(kubeseal_path, staging_key, "portfolio-secrets", "blog-staging", cert_path)
    
    print(f"Updating {prod_values_path}...")
    update_yaml_file(prod_values_path, "JWT_SECRET:", prod_sealed)
    
    print(f"Updating {staging_values_path}...")
    update_yaml_file(staging_values_path, "JWT_SECRET:", staging_sealed)
    
    print("Successfully completed!")
    
    # Save keys temporarily so we can check them in verification
    with open("temp_keys.txt", "w") as f:
        f.write(f"PROD:{prod_key}\nSTAGING:{staging_key}\n")

if __name__ == "__main__":
    main()

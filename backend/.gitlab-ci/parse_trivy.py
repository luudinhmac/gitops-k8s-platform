import json
import glob
import sys

critical_count = 0
high_count = 0
vulnerabilities = []

# Look for all trivy json files
json_files = glob.glob("trivy-*.json")

for file_path in json_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            results = data.get("Results", [])
            if not results:
                continue
                
            for result in results:
                # 1. Parse Vulnerabilities
                vulns = result.get("Vulnerabilities", [])
                for vuln in vulns:
                    severity = vuln.get("Severity", "")
                    vuln_id = vuln.get("VulnerabilityID", "")
                    pkg_name = vuln.get("PkgName", "")
                    
                    if severity == "CRITICAL":
                        critical_count += 1
                        vulnerabilities.append((severity, vuln_id, pkg_name))
                    elif severity == "HIGH":
                        high_count += 1
                        vulnerabilities.append((severity, vuln_id, pkg_name))
                        
                # 2. Parse Secrets
                secrets = result.get("Secrets", [])
                for secret in secrets:
                    severity = secret.get("Severity", "")
                    rule_id = secret.get("RuleID", "Secret Detected")
                    title = secret.get("Title", "Secret")
                    if severity == "CRITICAL":
                        critical_count += 1
                        vulnerabilities.append((severity, rule_id, f"{title} in {result.get('Target', '')}"))
                    elif severity == "HIGH":
                        high_count += 1
                        vulnerabilities.append((severity, rule_id, f"{title} in {result.get('Target', '')}"))
                        
                # 3. Parse Misconfigurations
                misconfigs = result.get("Misconfigurations", [])
                for misconfig in misconfigs:
                    severity = misconfig.get("Severity", "")
                    id_ = misconfig.get("ID", "Config ID")
                    type_ = misconfig.get("Type", "Config Type")
                    if severity == "CRITICAL":
                        critical_count += 1
                        vulnerabilities.append((severity, id_, f"{type_} in {result.get('Target', '')}"))
                    elif severity == "HIGH":
                        high_count += 1
                        vulnerabilities.append((severity, id_, f"{type_} in {result.get('Target', '')}"))
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")

# If we have any high or critical issues, we format the summary file
if critical_count > 0 or high_count > 0:
    # Sort: CRITICAL first, then HIGH
    vulnerabilities.sort(key=lambda x: 0 if x[0] == "CRITICAL" else 1)
    
    with open("trivy_summary.txt", "w", encoding="utf-8") as f:
        f.write("🚨 <b>Security Scan</b>\n")
        f.write(f"CRITICAL: {critical_count}\n")
        f.write(f"HIGH: {high_count}\n\n")
        
        f.write("🔥 <b>Top Issue</b>\n")
        if vulnerabilities:
            severity, vuln_id, pkg_name = vulnerabilities[0]
            f.write(f"{vuln_id}\n")
            f.write(f"Package: {pkg_name}\n")
            
    sys.exit(1)
else:
    sys.exit(0)

import os, json, urllib.request

def main():
    # 1. Get Project info
    with open(".vercel/project.json", "r") as f:
        proj = json.load(f)
        project_id = proj["projectId"]
        team_id = proj.get("orgId")
        
    # 2. Get Token
    token = None
    auth_paths = [
        os.path.expanduser(r"~\AppData\Roaming\vercel\auth.json"),
        os.path.expanduser(r"~\AppData\Local\vercel\auth.json"),
        os.path.expanduser(r"~\.local\share\com.vercel.cli\auth.json")
    ]
    for p in auth_paths:
        if os.path.exists(p):
            with open(p, "r") as f:
                auth = json.load(f)
                token = auth.get("token")
            break
            
    if not token:
        print("No vercel token found.")
        return

    # 3. API Call
    url = f"https://api.vercel.com/v9/projects/{project_id}?teamId={team_id}"
    data = json.dumps({"rootDirectory": "frontend", "framework": "nextjs"}).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="PATCH")
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    
    try:
        with urllib.request.urlopen(req) as resp:
            print("Status:", resp.status)
            print("Success! Root Directory updated to 'frontend'.")
    except Exception as e:
        print("Error:", e)
        if hasattr(e, 'read'):
            print("Response:", e.read().decode())

if __name__ == "__main__":
    main()

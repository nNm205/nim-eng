def extract_mistakes(response):
    lines = response.split("\n")

    mistakes = []
    capture = False 

    for line in lines: 
        if "[MISTAKES]" in line: 
                capture = True 
                continue 
        
        if capture and line.startswith("-"):
            parts = line.replace("-", "").strip()
            if "type:" in parts and "example:" in parts:
                t = parts.split("type:")[1].split("example:")[0].strip()
                e = parts.split("example:")[1].strip()
                mistakes.append((t, e))
    
    return mistakes

def extract_score(response):
    lines = response.split("\n")

    capture = False 
    for line in lines:
        if "[SCORE]" in line: 
            capture = True 
            continue 

        if capture:
            line = line.strip()
            if line.replace(".", "", 1).isdigit():
                return float(line)
    
    return None
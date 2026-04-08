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
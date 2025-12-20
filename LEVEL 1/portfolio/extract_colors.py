from PIL import Image
import math

img_path = 'profile.jpg'
try:
    img = Image.open(img_path).convert('RGB')
except Exception as e:
    print('ERROR:', e)
    raise SystemExit(1)

img = img.resize((120, 120))
colors = img.getcolors(120*120)
if not colors:
    print('ERROR: no colors found')
    raise SystemExit(2)

# sort descending by count
colors.sort(reverse=True)

picked = []
for count, col in colors:
    if len(picked) >= 8:
        break
    skip = False
    for p in picked:
        d = math.sqrt(sum((a-b)**2 for a,b in zip(p,col)))
        if d < 30:
            skip = True
            break
    if not skip:
        picked.append(col)

primary = picked[0]
# darker and lighter
def clamp(v):
    return max(0,min(255,int(v)))

darker = tuple(clamp(c*0.78) for c in primary)
lighter = tuple(clamp(255 - (255-c)*0.88) for c in primary)

def hexrgb(c):
    return '#%02x%02x%02x' % c

print('PRIMARY', hexrgb(primary))
print('DARKER', hexrgb(darker))
print('LIGHTER', hexrgb(lighter))
print('SAMPLES', ','.join(hexrgb(c) for c in picked[:6]))

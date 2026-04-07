import re

filepath = 'd:/Tonguefeast/Tonguefeast/products.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the duplicate 'btn-outline-primary' buttons
# Pattern: <a ... class="btn btn-outline-primary" ...> ... Enquire</a>
# We want to keep the 'btn-whatsapp' one.

old_wa_pattern = r'<a href="https://wa\.me/917263983233\?text=Hello!%20I%20am%20interested%20in%20enquiring%20about%20(.*?)\." class="btn btn-outline-primary" target="_blank" rel="noopener" style="margin-top:15px; width:100%;text-align:center;padding:8px;font-size:0.9rem;border-radius:4px;display:flex;justify-content:center;align-items:center;gap:8px;"><i class="fa-brands fa-whatsapp" style="color:#25D366;font-size:1.1rem;"></i> Enquire</a>'

new_content = re.sub(old_wa_pattern, '', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Removed duplicate buttons from products.html")

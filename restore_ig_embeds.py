import re

filepath = 'd:/Tonguefeast/Tonguefeast/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Restore Instagram embeds
instagram_embeds = """
  <!-- ═══════════ INSTAGRAM SNEAK PEEK ═══════════ -->
  <section class="section instagram-section">
    <div class="container">
      <div class="text-center reveal">
        <span class="section-label">Follow Us</span>
        <h2 class="section-title">Join Our Community</h2>
        <p class="section-subtitle">Catch up with the latest updates and delicious recipes on our Instagram.</p>
      </div>
      <div class="instagram-grid">
        <div class="ig-card reveal delay-1" style="aspect-ratio: auto; min-height: 450px;">
          <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DWwHCUojYKT/" data-instgrm-version="14" style=" background:#FFF; border:0; margin: 1px; width:100%; min-width:326px; border-radius: 12px; height: 100%;"></blockquote>
        </div>
        <div class="ig-card reveal delay-2" style="aspect-ratio: auto; min-height: 450px;">
          <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DV293GzjeaG/" data-instgrm-version="14" style=" background:#FFF; border:0; margin: 1px; width:100%; min-width:326px; border-radius: 12px; height: 100%;"></blockquote>
        </div>
        <div class="ig-card reveal delay-3" style="aspect-ratio: auto; min-height: 450px;">
          <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DTeqvXICs7_/" data-instgrm-version="14" style=" background:#FFF; border:0; margin: 1px; width:100%; min-width:326px; border-radius: 12px; height: 100%;"></blockquote>
        </div>
        <div class="ig-card reveal delay-4" style="aspect-ratio: auto; min-height: 450px;">
          <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DSzqPoQExsd/" data-instgrm-version="14" style=" background:#FFF; border:0; margin: 1px; width:100%; min-width:326px; border-radius: 12px; height: 100%;"></blockquote>
        </div>
      </div>
      <div class="ig-dots">
        <button class="ig-dot active" data-index="0"></button>
        <button class="ig-dot" data-index="1"></button>
        <button class="ig-dot" data-index="2"></button>
        <button class="ig-dot" data-index="3"></button>
      </div>
      <div class="text-center" style="margin-top: 40px;">
        <a href="https://www.instagram.com/ig_tonguefeast/" target="_blank" rel="noopener" class="btn btn-instagram">
          <i class="fa-brands fa-instagram"></i> Follow @ig_tonguefeast
        </a>
      </div>
      <script async src="//www.instagram.com/embed.js"></script>
    </div>
  </section>
"""

# Regex for instagram-section
ig_section_pattern = r'  <!-- ═══════════ INSTAGRAM SNEAK PEEK ═══════════ -->.*?<i class="fa-brands fa-instagram"></i> Follow @ig_tonguefeast\n        </a>\n      </div>\n    </div>\n  </section>'
content = re.sub(ig_section_pattern, instagram_embeds, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Restored Instagram embeds in index.html")

# Images Directory Structure

This directory contains all static images for the Earwax Clinic Network website.

## Directory Structure:

### `/clinic-images/`
Individual clinic photos and hero images
- Format: JPG/PNG optimized for web
- Naming: `{city}-{clinic-slug}-{type}.jpg`
- Examples:
  - `manchester-city-centre-hero.jpg`
  - `london-harley-street-1.jpg`
  - `glasgow-merchant-city-2.jpg`

### `/fallback-images/`
Default/placeholder images when specific clinic images aren't available
- `clinic-hero-default.jpg` - Default clinic hero image
- `practitioner-default.jpg` - Default practitioner photo
- `treatment-room-default.jpg` - Default treatment room image

### `/og-images/`
Open Graph social media images (1200x630px)
- `og-default.jpg` - Default OG image for pages
- `og-homepage.jpg` - Homepage specific OG image
- `og-clinics.jpg` - Clinic pages OG image

### `/icons/`
Service and feature icons
- `microsuction-icon.svg`
- `irrigation-icon.svg`
- `hearing-test-icon.svg`
- `certification-icons/` - Professional certification logos

## Image Requirements:
- **Hero Images**: 1920x1080px (16:9 ratio)
- **Gallery Images**: 800x600px (4:3 ratio)
- **Practitioner Photos**: 300x300px (1:1 ratio)
- **Open Graph**: 1200x630px (1.91:1 ratio)
- **Icons**: SVG preferred, or 64x64px PNG

## Optimization:
- Use WebP format where supported
- Compress images for web (85% quality for JPG)
- Include alt text in code for accessibility
- Lazy loading implemented in components

## Brand Guidelines:
- Use professional medical photography
- Maintain consistent lighting and color tone
- Include brand colors where appropriate (#00796B primary)
- Ensure diversity and inclusivity in people photography
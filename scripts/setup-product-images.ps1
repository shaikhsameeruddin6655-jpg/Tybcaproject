# Download paint / interior / exterior themed product images (verified Unsplash URLs)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$productsDir = Join-Path $root 'frontend\images\products'
$hero = Join-Path $root 'frontend\images\hero-painting.jpg'
$placeholder = Join-Path $root 'frontend\images\placeholder.jpg'
$force = $args -contains '-Force'

New-Item -ItemType Directory -Force -Path $productsDir | Out-Null

# Verified download URLs (interior, exterior, commercial spaces)
$pool = @{
    interior1 = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=82'
    interior2 = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=82'
    interior3 = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=82'
    interior4 = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=82'
    bedroom   = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=82'
    living    = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=82'
    office    = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=82'
    kitchen   = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=82'
    exterior1 = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=82'
    exterior2 = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=82'
    exterior3 = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=82'
    kids      = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=82'
    restaurant= 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=82'
    industrial= 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=82'
}

$productImages = @{
    'bedroom-elegant'       = @('hero', 'bedroom', 'interior1', 'interior3')
    'kitchen-modern'        = @('hero', 'kitchen', 'interior4', 'interior2')
    'house-exterior'        = @('exterior1', 'exterior2', 'exterior3', 'hero')
    'office-commercial'     = @('office', 'interior1', 'interior2', 'hero')
    'kids-room'             = @('kids', 'bedroom', 'interior3', 'hero')
    'restaurant-interior'   = @('restaurant', 'interior4', 'interior2', 'hero')
    'living-luxury'         = @('living', 'interior2', 'interior1', 'hero')
    'industrial-exterior'   = @('industrial', 'exterior1', 'exterior2', 'hero')
}

function Save-ImageUrl($url, $outFile) {
    Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing -TimeoutSec 45
}

function Save-ImageKey($key, $outFile) {
    if ($key -eq 'hero') {
        if (Test-Path $hero) {
            Copy-Item $hero $outFile -Force
            return
        }
        $key = 'interior1'
    }
    Save-ImageUrl $pool[$key] $outFile
}

foreach ($slug in $productImages.Keys) {
    $keys = $productImages[$slug]
    for ($i = 0; $i -lt $keys.Count; $i++) {
        if ($i -eq 0) { $name = $slug } else { $name = "$slug-$i" }
        $outFile = Join-Path $productsDir "$name.jpg"
        if ((Test-Path $outFile) -and -not $force) { continue }

        try {
            Save-ImageKey $keys[$i] $outFile
            Write-Host "Saved $name.jpg ($($keys[$i]))"
        } catch {
            if (Test-Path $hero) {
                Copy-Item $hero $outFile -Force
                Write-Host "Fallback hero for $name.jpg"
            } else {
                Write-Warning "Failed $name : $_"
            }
        }
    }
}

if (Test-Path $hero) {
    Copy-Item $hero $placeholder -Force
} elseif (Test-Path (Join-Path $productsDir 'bedroom-elegant.jpg')) {
    Copy-Item (Join-Path $productsDir 'bedroom-elegant.jpg') $placeholder -Force
}

Write-Host 'Paint-themed product images ready.'

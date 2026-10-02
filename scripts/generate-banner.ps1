Add-Type -AssemblyName System.Drawing
$width = 1200
$height = 630
$bmp = [System.Drawing.Bitmap]::new($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Background Gradient
$rect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
$c1 = [System.Drawing.ColorTranslator]::FromHtml('#090d16')
$c2 = [System.Drawing.ColorTranslator]::FromHtml('#1e1b4b')
$brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $c1, $c2, [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
$g.FillRectangle($brush, $rect)

# Accent line on top
$cBlue = [System.Drawing.ColorTranslator]::FromHtml('#3b82f6')
$accentPen = [System.Drawing.Pen]::new($cBlue, 8)
$g.DrawLine($accentPen, 0, 4, $width, 4)

# Top Badge
$cBadge = [System.Drawing.ColorTranslator]::FromHtml('#1e293b')
$badgeBrush = [System.Drawing.SolidBrush]::new($cBadge)
$g.FillRectangle($badgeBrush, 80, 75, 430, 40)
$cCyan = [System.Drawing.ColorTranslator]::FromHtml('#38bdf8')
$badgeBorder = [System.Drawing.Pen]::new($cCyan, 1.5)
$g.DrawRectangle($badgeBorder, 80, 75, 430, 40)

$fontBadge = [System.Drawing.Font]::new('Segoe UI', 12, [System.Drawing.FontStyle]::Bold)
$brushCyan = [System.Drawing.SolidBrush]::new($cCyan)
$g.DrawString('★  REPOSITORI TERBUKA PEJUANG PTN', $fontBadge, $brushCyan, 95, 84)

# Main Title
$fontTitle = [System.Drawing.Font]::new('Segoe UI', 46, [System.Drawing.FontStyle]::Bold)
$brushWhite = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$g.DrawString('Bank Materi & Latsol', $fontTitle, $brushWhite, 80, 135)

# Colored Sub-title
$fontSub = [System.Drawing.Font]::new('Segoe UI', 38, [System.Drawing.FontStyle]::Bold)
$cIndigo = [System.Drawing.ColorTranslator]::FromHtml('#818cf8')
$brushIndigo = [System.Drawing.SolidBrush]::new($cIndigo)
$g.DrawString('TKA & SNBT by frenzych', $fontSub, $brushIndigo, 80, 215)

# Description text
$fontDesc = [System.Drawing.Font]::new('Segoe UI', 17, [System.Drawing.FontStyle]::Regular)
$cGray = [System.Drawing.ColorTranslator]::FromHtml('#cbd5e1')
$brushGray = [System.Drawing.SolidBrush]::new($cGray)
$g.DrawString("Pusat modul PDF, rangkuman materi, dan video pembahasan terlengkap.`nTerstruktur hierarkis untuk persiapan UTBK-SNBT & Ujian Mandiri.", $fontDesc, $brushGray, 80, 295)

# Badges
$fontPill = [System.Drawing.Font]::new('Segoe UI', 14, [System.Drawing.FontStyle]::Bold)

$pillBg1 = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#1e3a8a'))
$g.FillRectangle($pillBg1, 80, 400, 250, 50)
$g.DrawString('⚡ 1.000+ Modul Live', $fontPill, $brushWhite, 105, 413)

$pillBg2 = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#065f46'))
$g.FillRectangle($pillBg2, 350, 400, 290, 50)
$g.DrawString('📘 TKA Wajib & Pilihan', $fontPill, $brushWhite, 375, 413)

$pillBg3 = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#4c1d95'))
$g.FillRectangle($pillBg3, 660, 400, 260, 50)
$g.DrawString('🎓 Subtes UTBK-SNBT', $fontPill, $brushWhite, 685, 413)

# Footer bar in image
$thinPen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#334155'), 2)
$g.DrawLine($thinPen, 80, 520, 1120, 520)
$fontUrl = [System.Drawing.Font]::new('Segoe UI', 15, [System.Drawing.FontStyle]::Bold)
$brushUrl = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#94a3b8'))
$g.DrawString('🌐 bank-materi.vercel.app', $fontUrl, $brushUrl, 80, 545)

$g.Dispose()
$outPath = Join-Path (Get-Location) 'public\og-banner.png'
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Banner saved cleanly to $outPath"

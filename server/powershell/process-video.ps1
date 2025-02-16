param(
    [Parameter(Mandatory=$true)]
    [string]$inputVideo,
    [string]$outputVideo = ($inputVideo -replace '\.([^\.]+)$', '_2x.$1')
)

# Check if input file exists
if (-not (Test-Path $inputVideo)) {
    Write-Error "Input video file not found: $inputVideo"
    exit 1
}

# Process video with balanced settings for quality and compatibility
# -quality good for balanced encoding
# -cpu-used 0 for best quality (range 0-5, where 0 is best quality)
# -b:v 1500k for reasonable bitrate
ffmpeg -i $inputVideo -vf "setpts=0.5*PTS" -c:v vp8 -quality good -cpu-used 0 -b:v 1500k $outputVideo 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Video processing complete. Output saved to: $outputVideo"
    exit 0
} else {
    Write-Error "FAILED: Video processing failed with exit code $LASTEXITCODE"
    exit 1
}

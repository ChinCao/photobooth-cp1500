param(
    [Parameter(Mandatory=$true)]
    [string]$inputVideo,
    [string]$outputVideo = ($inputVideo -replace '\.webm$', '_2x.mp4')
)

# Check if input file exists
if (-not (Test-Path $inputVideo)) {
    Write-Error "Input video file not found: $inputVideo"
    exit 1
}

# Process video with maximum quality settings
# -vf "scale=..." ensures even dimensions required by H.264
# -c:v libx264 for H.264 video codec
# -crf 17 for very high quality (range 0-51, lower is better, 0 is lossless)
# -preset veryslow for best possible compression
# -tune film for optimal quality
# -movflags +faststart for web playback optimization
ffmpeg -i $inputVideo -vf "scale=796:556,setpts=0.5*PTS" -c:v libx264 -crf 17 -preset veryslow -tune film -movflags +faststart -f mp4 ($outputVideo -replace '\.webm$', '.mp4') 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Video processing complete. Output saved to: $outputVideo"
    exit 0
} else {
    Write-Error "FAILED: Video processing failed with exit code $LASTEXITCODE"
    exit 1
}

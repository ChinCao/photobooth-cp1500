function print-image {
    param(
        [string]$imageName = $(throw "Enter image name to print"),
        [string]$printer = "",
        [bool]$fitImageToPaper = $true
    )

    trap { break; }

    # Load the necessary assembly
    [void][System.Reflection.Assembly]::LoadWithPartialName("System.Drawing")

    $printDocument = New-Object System.Drawing.Printing.PrintDocument
    if ($printer -ne "") {
        $printDocument.PrinterSettings.PrinterName = $printer
    }

    $printDocument.DocumentName = [System.IO.Path]::GetFileName($imageName)

    $printDocument.add_PrintPage({
        param($sender, $e)

        # Load the image
        $image = New-Object System.Drawing.Bitmap $imageName
        $g = $e.Graphics
        $pageBounds = $e.MarginBounds

        # Calculate adjusted size
        $adjustedImageSize = $image.Size
        $ratio = [double]1

        if ($fitImageToPaper) {
            $fitWidth = [bool]($image.Size.Width -gt $image.Size.Height)
            if (($image.Size.Width -le $e.MarginBounds.Width) -and ($image.Size.Height -le $e.MarginBounds.Height) ) {
                $adjustedImageSize = New-Object System.Drawing.SizeF($image.Size.Width, $image.Size.Height)
            } else {
                if ($fitWidth) {
                    $ratio = [double]($e.MarginBounds.Width / $image.Size.Width)
                } else {
                    $ratio = [double]($e.MarginBounds.Height / $image.Size.Height)
                }
                $adjustedImageSize = New-Object System.Drawing.SizeF($e.MarginBounds.Width, [float]($image.Size.Height * $ratio))
            }
        }

        # Draw the image
        $recDest = New-Object Drawing.RectangleF($pageBounds.Location, $adjustedImageSize)
        $recSrc = New-Object Drawing.RectangleF(0, 0, $image.Width, $image.Height)
        $g.DrawImage($image, $recDest, $recSrc, [Drawing.GraphicsUnit]::Pixel)

        # Indicate there are no more pages to print
        $e.HasMorePages = $false
    })

    $printDocument.Print()
}

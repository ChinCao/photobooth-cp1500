param(
    [string]$imagePath, 
    [string]$printer, 
    [int]$copies = 1
)

function printImage { 
    param(
        [string]$imagePath, 
        [string]$printer, 
        [int]$copies = 1
    )
   
    trap { break; }
   
    [void][System.Reflection.Assembly]::LoadWithPartialName("System.Drawing")
   
    $bitmap = $null
   
    $doc = new-object System.Drawing.Printing.PrintDocument
    if ($printer -ne "") {
        $doc.PrinterSettings.PrinterName = $printer
    }
    
    $doc.DocumentName = [System.IO.Path]::GetFileName($imagePath)
    
    $doc.PrinterSettings.Copies = $copies
   
    $doc.add_EndPrint({
        if ($null -ne $bitmap) {
            $bitmap.Dispose()
            $bitmap = $null
        }
    })
    
    $doc.add_PrintPage({
        $img = new-object Drawing.Bitmap($imagePath)
        $_.Graphics.DrawImage($img, $_.Graphics.VisibleClipBounds)
        $_.HasMorePages = $false;
    })
    
    $doc.Print()
}

printImage -imagePath $imagePath -printer $printer -copies $copies

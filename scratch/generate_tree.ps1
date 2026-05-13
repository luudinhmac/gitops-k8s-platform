function Get-ProjectTree {
    param (
        [string]$Path,
        [int]$MaxDepth = 4
    )
    
    Get-ChildItem -Path $Path -Recurse -Depth $MaxDepth | 
        Where-Object { $_.FullName -notmatch 'node_modules|dist|\.next|\.git|build|temp' } |
        Select-Object @{Name="RelativePath"; Expression={ $_.FullName.Replace((Get-Item $Path).Parent.FullName + "\", "") }} |
        ForEach-Object {
            $parts = $_.RelativePath.Split('\')
            $indent = "--" * ($parts.Count - 1)
            $indent + $parts[-1]
        }
}

$output = "Project Structure`n" + ("=" * 20) + "`n`n"
$output += "BACKEND`n" + ("-" * 10) + "`n"
$output += (Get-ProjectTree -Path "backend" -MaxDepth 4 | Out-String) + "`n"
$output += "FRONTEND`n" + ("-" * 10) + "`n"
$output += (Get-ProjectTree -Path "frontend" -MaxDepth 4 | Out-String) + "`n"
$output += "INFRA`n" + ("-" * 10) + "`n"
$output += (Get-ProjectTree -Path "infra" -MaxDepth 4 | Out-String) + "`n"

$output | Out-File -FilePath "project_structure.txt" -Encoding utf8

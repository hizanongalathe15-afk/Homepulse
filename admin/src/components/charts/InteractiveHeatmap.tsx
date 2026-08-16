'use client'

interface InteractiveHeatmapProps {
  data: Array<Record<string, number | string>>
  xKey: string
  yKey: string
  valueKey: string
  height?: number
  title?: string
  description?: string
  accentColor?: string
  cellSize?: number
  gap?: number
  onCellClick?: (x: string, y: string, value: number) => void
}

export function InteractiveHeatmap({
  data,
  xKey,
  yKey,
  valueKey,
  height = 300,
  title,
  description,
  accentColor = '#0ea5e9',
  cellSize = 36,
  gap = 4,
  onCellClick,
}: InteractiveHeatmapProps) {
  const xAxis = Array.from(new Set(data.map((d) => String(d[xKey]))))
  const yAxis = Array.from(new Set(data.map((d) => String(d[yKey]))))
  const maxValue = Math.max(...data.map((d) => Number(d[valueKey]) || 0), 1)

  const gridWidth = xAxis.length * (cellSize + gap) - gap
  const gridHeight = yAxis.length * (cellSize + gap) - gap
  const labelOffsetX = 48
  const labelOffsetY = 24

  const totalWidth = labelOffsetX + gridWidth + 16
  const totalHeight = labelOffsetY + gridHeight + 40

  const intensityToColor = (value: number) => {
    const t = Math.min(value / maxValue, 1)
    const r = Math.round(14 + (0 - 14) * t)
    const g = Math.round(165 + (255 - 165) * t)
    const b = Math.round(233 + (255 - 233) * t)
    const a = 0.2 + 0.8 * t
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  return (
    <div className="admin-heatmap-wrapper">
      {(title || description) && (
        <div className="mb-4">
          {title && <h4 className="text-sm font-semibold text-slate-900">{title}</h4>}
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      )}
      <div className="relative overflow-x-auto rounded-lg border border-slate-200/60 bg-white/40 backdrop-blur-sm">
        <svg
          width={totalWidth}
          height={Math.max(totalHeight, height)}
          className="block"
        >
          {xAxis.map((x, i) => (
            <text
              key={`x-${x}`}
              x={labelOffsetX + i * (cellSize + gap) + cellSize / 2}
              y={12}
              textAnchor="middle"
              className="text-[10px] font-medium fill-slate-500"
            >
              {x}
            </text>
          ))}
          {yAxis.map((y, j) => (
            <text
              key={`y-${y}`}
              x={labelOffsetX - 8}
              y={labelOffsetY + j * (cellSize + gap) + cellSize / 2 + 4}
              textAnchor="end"
              className="text-[10px] font-medium fill-slate-500"
            >
              {y}
            </text>
          ))}
          {xAxis.map((x, i) =>
            yAxis.map((y, j) => {
              const cell = data.find(
                (d) => String(d[xKey]) === x && String(d[yKey]) === y
              )
              const value = Number(cell?.[valueKey]) || 0
              const cx = labelOffsetX + i * (cellSize + gap)
              const cy = labelOffsetY + j * (cellSize + gap)
              const fill = intensityToColor(value)

              return (
                <rect
                  key={`${x}-${y}`}
                  x={cx}
                  y={cy}
                  width={cellSize}
                  height={cellSize}
                  rx={4}
                  fill={fill}
                  className="transition-all duration-200 hover:brightness-110 cursor-pointer"
                  style={{ filter: `drop-shadow(0 0 2px ${accentColor}33)` }}
                  onClick={() => onCellClick?.(x, y, value)}
                >
                  <title>{`${x}, ${y}: ${value}`}</title>
                </rect>
              )
            })
          )}
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-slate-500">Intensity scale</span>
        <div className="flex items-center gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <div
              key={t}
              className="w-4 h-2 rounded-sm"
              style={{
                backgroundColor: `rgba(${Math.round(14 + (0 - 14) * t)}, ${Math.round(165 + (255 - 165) * t)}, ${Math.round(233 + (255 - 233) * t)}, ${0.2 + 0.8 * t})`,
                boxShadow: `0 0 4px ${accentColor}44`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

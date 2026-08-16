'use client'

interface HeatmapChartProps {
  data: Array<{
    x: string
    y: string
    value: number
  }>
  xKey?: string
  yKey?: string
  valueKey?: string
  height?: number
}

export function AdminHeatmap({
  data,
  xKey = 'x',
  yKey = 'y',
  valueKey = 'value',
  height = 300,
}: HeatmapChartProps) {
  const xAxis = Array.from(new Set(data.map((d) => String(d[xKey as keyof typeof d]))))
  const yAxis = Array.from(new Set(data.map((d) => String(d[yKey as keyof typeof d]))))
  const maxValue = Math.max(...data.map((d) => Number(d[valueKey as keyof typeof d]) || 0), 1)

  return (
    <div className="overflow-x-auto" style={{ height }}>
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `auto repeat(${xAxis.length}, minmax(40px, 1fr))` }}>
        <div />
        {xAxis.map((x) => (
          <div key={x} className="text-xs text-slate-500 text-center py-2 font-medium">
            {x}
          </div>
        ))}

        {yAxis.map((y) => (
          <>
            <div key={`label-${y}`} className="text-xs text-slate-500 py-2 font-medium flex items-center">
              {y}
            </div>
            {xAxis.map((x) => {
              const cell = data.find((d) => String(d[xKey as keyof typeof d]) === x && String(d[yKey as keyof typeof d]) === y)
              const value = Number(cell?.[valueKey as keyof typeof cell] as number | undefined) || 0
              const opacity = Math.min(value / maxValue, 1)

              return (
                <div
                  key={`${x}-${y}`}
                  className="w-10 h-10 rounded flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: `rgba(14, 165, 233, ${opacity})` }}
                  title={`${x}, ${y}: ${value}`}
                >
                  {value}
                </div>
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}

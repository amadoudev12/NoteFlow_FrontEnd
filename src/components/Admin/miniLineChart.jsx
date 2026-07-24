function LineSparkChart({ data }) {
    if (!data?.length) return null;
    const W = 600, H = 200, PAD = 40;
    const values = data.map(d => parseFloat(d.moyenne));
    const min = Math.min(...values) - 1;
    const max = Math.max(...values) + 1;
    const xStep = (W - PAD * 2) / (values.length - 1);
    const yScale = v => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
    const points = values.map((v, i) => [PAD + i * xStep, yScale(v)]);
    const linePath = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `C${p[0] - xStep / 2},${points[i-1][1]} ${p[0] - xStep / 2},${p[1]} ${p[0]},${p[1]}`)).join(" ");
    const areaPath = linePath + ` L${points[points.length-1][0]},${H-PAD} L${PAD},${H-PAD} Z`;
    if(!data[0].moyenne){
        return (
            <div className="flex items-center justify-center">
                le trimestre est en cours
            </div>
        )
    }
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
        <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0,1,2,3].map(i => {
            const y = PAD + i * ((H - PAD * 2) / 3);
            const val = (max - (i * (max - min) / 3)).toFixed(1);
            return (
            <g key={i}>
                <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
                <text x={PAD - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{val}</text>
            </g>
            );
        })}
        {/* Area fill */}
        <path d={areaPath} fill="url(#lineGrad)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Points + labels */}
        {points.map((p, i) => (
            <g key={i}>
            <circle cx={p[0]} cy={p[1]} r="5" fill="#3b82f6" stroke="white" strokeWidth="2" />
            <text x={p[0]} y={p[1] - 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e40af">
                {values[i].toFixed(1)}
            </text>
            <text x={p[0]} y={H - PAD + 16} textAnchor="middle" fontSize="11" fill="#64748b">
                {data[i].trimestre}
            </text>
            </g>
        ))}
        </svg>
    );
}

export default LineSparkChart
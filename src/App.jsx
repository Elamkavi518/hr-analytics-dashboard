import React, { useMemo, useState } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from "recharts";
import {
  Users, TrendingDown, TrendingUp, Wallet, UserPlus, Star, Search,
  ChevronDown, ArrowUpRight, ArrowDownRight, Circle, LayoutGrid,
  Building2, DollarSign, UserCheck, Gauge, Bell, Download
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS
   Ink        #171B21   primary text
   Paper      #F6F5F2   canvas
   Card       #FFFFFF   surface
   Line       #E4E1D9   hairline borders
   Forest     #2F6E5C   retention / positive / hires
   Brick      #B54B3A   attrition / risk / exits
   Gold       #C99A3E   highlight / benchmark
   Slate      #5B6472   secondary text / neutral series
------------------------------------------------------------------ */
const C = {
  ink: "#171B21", paper: "#F6F5F2", card: "#FFFFFF", line: "#E4E1D9",
  forest: "#2F6E5C", forestSoft: "#DCEAE4", brick: "#B54B3A", brickSoft: "#F3E1DC",
  gold: "#C99A3E", goldSoft: "#F3E7CE", slate: "#5B6472", slateSoft: "#EDEBE5",
};

const DEPTS = ["Engineering", "Sales", "Customer Success", "Marketing", "Product", "Finance", "Operations", "People"];
const DEPT_COLOR = { Engineering: C.forest, Sales: C.gold, "Customer Success": C.slate, Marketing: C.brick, Product: "#3E5C7C", Finance: "#8A6D3B", Operations: "#6B7A5A", People: "#8B5E83" };
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function seeded(seed){ let s = seed; return () => { s = (s*9301+49297)%233280; return s/233280; }; }
const rnd = seeded(42);
const pick = (arr) => arr[Math.floor(rnd()*arr.length)];
const rint = (a,b) => Math.floor(a + rnd()*(b-a+1));

/* ---------------------------------------------------------------
   MOCK DATA — built once, deterministic
------------------------------------------------------------------ */
const deptBaseHeadcount = { Engineering: 118, Sales: 74, "Customer Success": 46, Marketing: 28, Product: 34, Finance: 22, Operations: 30, People: 14 };
const deptBaseSalary = { Engineering: [78000,168000], Sales: [58000,132000], "Customer Success": [52000,96000], Marketing: [56000,118000], Product: [82000,158000], Finance: [64000,124000], Operations: [50000,98000], People: [56000,110000] };

const attritionTrend = MONTHS.map((m,i)=>{
  const voluntary = rint(4,9) + (i>7? 2:0);
  const involuntary = rint(1,4);
  const headcount = 360 + i*3 - (voluntary+involuntary)*1.4;
  return { month:m, voluntary, involuntary, total: voluntary+involuntary, rate: +(((voluntary+involuntary)/headcount)*100).toFixed(2) };
});

const hiringTrend = MONTHS.map((m,i)=>({
  month:m,
  hires: rint(8,18) + (i===2||i===8?6:0),
  exits: attritionTrend[i].total,
  openReqs: rint(14,34),
}));

const netHeadcount = (()=>{
  let hc = 352;
  return hiringTrend.map((d)=>{ hc += d.hires - d.exits; return { ...d, headcount: Math.round(hc) }; });
})();

const deptTable = DEPTS.map((d) => {
  const headcount = deptBaseHeadcount[d];
  const [lo,hi] = deptBaseSalary[d];
  const attrition = +(rnd()*8 + (d==="Sales"?6:2)).toFixed(1);
  const avgSalary = Math.round(lo + (hi-lo)*(0.35+rnd()*0.3));
  const avgPerf = +(3.1 + rnd()*1.3).toFixed(2);
  const openRoles = rint(1, d==="Engineering"?12:6);
  const avgTenure = +(1.2 + rnd()*4.2).toFixed(1);
  return { department: d, headcount, attrition, avgSalary, avgPerf, openRoles, avgTenure, min: lo, max: hi };
});

const tenureBuckets = [
  { bucket: "0–1 yr", exits: 34, color: C.brick },
  { bucket: "1–2 yr", exits: 22, color: C.brick },
  { bucket: "2–4 yr", exits: 15, color: C.gold },
  { bucket: "4–6 yr", exits: 8, color: C.forest },
  { bucket: "6+ yr", exits: 5, color: C.forest },
];

const exitReasons = [
  { reason: "Compensation", value: 27 },
  { reason: "Career growth", value: 23 },
  { reason: "Manager relationship", value: 17 },
  { reason: "Relocation", value: 11 },
  { reason: "Work-life balance", value: 13 },
  { reason: "Involuntary", value: 9 },
];
const REASON_COLORS = [C.brick, C.gold, "#8B5E83", C.slate, "#3E5C7C", C.ink];

const voluntaryInvoluntary = [
  { name: "Voluntary", value: 71, color: C.brick },
  { name: "Involuntary", value: 29, color: C.slate },
];

const salaryLevels = ["L1 Associate","L2 Mid","L3 Senior","L4 Lead","L5 Principal"].map((lvl,i)=>({
  level: lvl,
  min: 48000 + i*22000,
  median: 58000 + i*27000,
  max: 72000 + i*33000,
}));

const compaRatio = DEPTS.map(d => ({ department: d, ratio: +(0.88 + rnd()*0.26).toFixed(2) }));

const genderPay = [
  { department: "Engineering", men: 121000, women: 116500 },
  { department: "Sales", men: 91000, women: 88200 },
  { department: "Product", men: 118000, women: 114800 },
  { department: "Marketing", men: 84000, women: 85400 },
  { department: "Finance", men: 96000, women: 93100 },
];

const hiringFunnel = [
  { stage: "Applied", value: 100 },
  { stage: "Screened", value: 42 },
  { stage: "Interviewed", value: 21 },
  { stage: "Offer", value: 9 },
  { stage: "Hired", value: 6.4 },
];

const sourceOfHire = [
  { source: "Referral", value: 34, color: C.forest },
  { source: "LinkedIn", value: 28, color: C.gold },
  { source: "Job boards", value: 18, color: C.slate },
  { source: "Agency", value: 12, color: C.brick },
  { source: "University", value: 8, color: "#3E5C7C" },
];

const timeToFill = DEPTS.map(d => ({ department: d, days: rint(19, 58) }));

const perfDistribution = [
  { band: "Needs improvement", value: 6, color: C.brick },
  { band: "Meets expectations", value: 41, color: C.slate },
  { band: "Exceeds expectations", value: 38, color: C.gold },
  { band: "Outstanding", value: 15, color: C.forest },
];

const perfTrend = MONTHS.filter((_,i)=>i%2===0).map((m)=>({ cycle: m, avg: +(3.3 + rnd()*0.6).toFixed(2), engagement: rint(68,84) }));

const perfByDept = DEPTS.map(d => ({ department: d, performance: +(3.1+rnd()*1.2).toFixed(2), engagement: rint(60,88) }));

const highPerformerRetention = [
  { tier: "Outstanding", retained: 96, color: C.forest },
  { tier: "Exceeds", retained: 91, color: C.gold },
  { tier: "Meets", retained: 84, color: C.slate },
  { tier: "Needs improvement", retained: 61, color: C.brick },
];

const flightRiskDepts = deptTable
  .map(d => ({ ...d, risk: +(d.attrition*0.6 + (5-d.avgPerf)*3 + rnd()*4).toFixed(1) }))
  .sort((a,b)=>b.risk-a.risk).slice(0,5);

/* ---------------------------------------------------------------
   SMALL UI PRIMITIVES
------------------------------------------------------------------ */
function Card({ children, className="", pad=true }) {
  return (
    <div className={`bg-white border rounded-lg ${pad?"p-5":""} ${className}`} style={{ borderColor: C.line }}>
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, note }) {
  return (
    <div className="mb-5 flex items-end justify-between flex-wrap gap-2">
      <div>
        {eyebrow && <div className="text-[11px] tracking-[0.14em] uppercase font-semibold mb-1" style={{ color: C.forest }}>{eyebrow}</div>}
        <h2 className="text-2xl" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>{title}</h2>
      </div>
      {note && <div className="text-xs" style={{ color: C.slate }}>{note}</div>}
    </div>
  );
}

function KPI({ icon: Icon, label, value, delta, deltaLabel, positive }) {
  const good = positive;
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: C.slateSoft }}>
          <Icon size={16} color={C.ink} strokeWidth={1.75} />
        </div>
        {delta !== undefined && (
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: good ? C.forest : C.brick }}>
            {good ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}
            {delta}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl tabular-nums" style={{ fontFamily: "IBM Plex Mono, monospace", color: C.ink }}>{value}</div>
        <div className="text-xs mt-1" style={{ color: C.slate }}>{label}</div>
      </div>
      {deltaLabel && <div className="text-[11px]" style={{ color: C.slate }}>{deltaLabel}</div>}
    </Card>
  );
}

function CustomTooltip({ active, payload, label, suffix="" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border rounded-md px-3 py-2 text-xs shadow-sm" style={{ borderColor: C.line }}>
      <div className="font-semibold mb-1" style={{ color: C.ink }}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} className="flex items-center gap-2" style={{ color: C.slate }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color || p.fill }} />
          {p.name}: <span style={{ color: C.ink, fontFamily:"IBM Plex Mono, monospace" }}>{p.value}{suffix}</span>
        </div>
      ))}
    </div>
  );
}

function Pill({ children, tone="neutral" }) {
  const map = {
    neutral: { bg: C.slateSoft, fg: C.slate },
    good: { bg: C.forestSoft, fg: C.forest },
    bad: { bg: C.brickSoft, fg: C.brick },
    gold: { bg: C.goldSoft, fg: "#8A6D2A" },
  };
  const t = map[tone];
  return <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.fg }}>{children}</span>;
}

/* ---------------------------------------------------------------
   SECTIONS
------------------------------------------------------------------ */
function Overview() {
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Company snapshot" title="Workforce overview" note="Trailing 12 months · updated weekly" />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPI icon={Users} label="Active headcount" value="366" delta="+3.8%" positive deltaLabel="vs. last quarter" />
        <KPI icon={TrendingDown} label="Annualized attrition" value="12.4%" delta="-1.1 pts" positive deltaLabel="vs. last quarter" />
        <KPI icon={UserCheck} label="Avg. tenure" value="2.9 yr" delta="+0.2 yr" positive deltaLabel="vs. last quarter" />
        <KPI icon={UserPlus} label="Open requisitions" value="47" delta="+9" deltaLabel="vs. last quarter" />
        <KPI icon={Wallet} label="Avg. compa-ratio" value="1.02" delta="+0.03" positive deltaLabel="vs. target 1.00" />
        <KPI icon={Star} label="Avg. performance" value="3.74" delta="+0.08" positive deltaLabel="vs. last cycle" />
      </div>

      {/* SIGNATURE: Retention Pulse */}
      <Card>
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-[11px] tracking-[0.14em] uppercase font-semibold" style={{ color: C.forest }}>Signature view</div>
            <h3 className="text-lg" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Retention pulse — hires in, exits out</h3>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: C.slate }}>
            <span className="flex items-center gap-1"><Circle size={8} fill={C.forest} color={C.forest}/> Hires</span>
            <span className="flex items-center gap-1"><Circle size={8} fill={C.brick} color={C.brick}/> Exits</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={hiringTrend} margin={{ top: 20, right: 10, left: -10, bottom: 0 }} barGap={2}>
            <CartesianGrid vertical={false} stroke={C.line} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.slate }} axisLine={{ stroke: C.line }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <ReferenceLine y={0} stroke={C.line} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hires" name="Hires" fill={C.forest} radius={[3,3,0,0]} />
            <Bar dataKey="exits" name="Exits" fill={C.brick} radius={[0,0,3,3]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs mt-2" style={{ color: C.slate }}>
          Net headcount has grown every month since March; hiring in Q2 outpaced attrition even through the July exit spike, driven mainly by Sales.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Headcount by department</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={deptTable} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid horizontal={false} stroke={C.line} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="department" width={110} tick={{ fontSize: 11, fill: C.ink }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="headcount" name="Headcount" radius={[0,4,4,0]}>
                {deptTable.map((d,i)=><Cell key={i} fill={DEPT_COLOR[d.department]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Net headcount trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={netHeadcount} margin={{ left: -10, right: 10 }}>
              <defs>
                <linearGradient id="hcFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.forest} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={C.forest} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={C.line} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <YAxis domain={["dataMin-10","dataMax+10"]} tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="headcount" name="Headcount" stroke={C.forest} fill="url(#hcFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Attrition() {
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Retention" title="Attrition analysis" note="Voluntary + involuntary, trailing 12 months" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI icon={TrendingDown} label="Attrition rate" value="12.4%" delta="-1.1 pts" positive />
        <KPI icon={TrendingDown} label="Voluntary share" value="71%" delta="+4 pts" />
        <KPI icon={Gauge} label="Regretted loss" value="38%" delta="-3 pts" positive deltaLabel="of voluntary exits" />
        <KPI icon={Users} label="At-risk employees" value="24" delta="flagged this cycle" />
      </div>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Monthly attrition rate vs. exits</h3>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={attritionTrend} margin={{ left: -10, right: 10 }}>
            <CartesianGrid vertical={false} stroke={C.line} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="l" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="l" dataKey="total" name="Exits" fill={C.slateSoft} radius={[3,3,0,0]} barSize={18} />
            <Line yAxisId="r" type="monotone" dataKey="rate" name="Attrition rate %" stroke={C.brick} strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Exits by tenure</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tenureBuckets} margin={{ left: -10, right: 10 }}>
              <CartesianGrid vertical={false} stroke={C.line} />
              <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="exits" name="Exits" radius={[4,4,0,0]}>
                {tenureBuckets.map((t,i)=><Cell key={i} fill={t.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs mt-2" style={{ color: C.slate }}>56% of exits happen inside the first two years — the first-year onboarding experience is the highest-leverage retention fix.</p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Voluntary vs. involuntary</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={voluntaryInvoluntary} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                {voluntaryInvoluntary.map((v,i)=><Cell key={i} fill={v.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip suffix="%" />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: C.slate }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Exit interview: reasons cited</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={exitReasons} layout="vertical" margin={{ left: 30, right: 20 }}>
            <CartesianGrid horizontal={false} stroke={C.line} />
            <XAxis type="number" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="reason" width={140} tick={{ fontSize: 11, fill: C.ink }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip suffix="%" />} />
            <Bar dataKey="value" name="Share of exits" radius={[0,4,4,0]}>
              {exitReasons.map((_,i)=><Cell key={i} fill={REASON_COLORS[i % REASON_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Flight-risk watchlist</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide" style={{ color: C.slate }}>
              <th className="pb-2 font-medium">Department</th>
              <th className="pb-2 font-medium">Attrition</th>
              <th className="pb-2 font-medium">Avg. performance</th>
              <th className="pb-2 font-medium">Risk score</th>
            </tr>
          </thead>
          <tbody>
            {flightRiskDepts.map((d,i)=>(
              <tr key={i} className="border-t" style={{ borderColor: C.line }}>
                <td className="py-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: DEPT_COLOR[d.department] }} />{d.department}</td>
                <td className="py-2 tabular-nums" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{d.attrition}%</td>
                <td className="py-2 tabular-nums" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{d.avgPerf}</td>
                <td className="py-2"><Pill tone={d.risk>10?"bad":d.risk>7?"gold":"neutral"}>{d.risk}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Departments() {
  const radarData = DEPTS.slice(0,6).map(d => {
    const row = deptTable.find(x=>x.department===d);
    const perf = perfByDept.find(x=>x.department===d);
    return { department: d, headcount: Math.round(row.headcount/2), retention: Math.round((100-row.attrition)), performance: Math.round(perf.performance*20) };
  });
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Org structure" title="Department analysis" note="366 employees across 8 departments" />

      <Card pad={false}>
        <div className="p-5 pb-0">
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Department scorecard</h3>
        </div>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide" style={{ color: C.slate }}>
                <th className="pb-2 font-medium">Department</th>
                <th className="pb-2 font-medium">Headcount</th>
                <th className="pb-2 font-medium">Attrition</th>
                <th className="pb-2 font-medium">Avg. salary</th>
                <th className="pb-2 font-medium">Avg. tenure</th>
                <th className="pb-2 font-medium">Avg. performance</th>
                <th className="pb-2 font-medium">Open roles</th>
              </tr>
            </thead>
            <tbody>
              {deptTable.map((d,i)=>(
                <tr key={i} className="border-t" style={{ borderColor: C.line }}>
                  <td className="py-2.5 flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: DEPT_COLOR[d.department] }} />{d.department}</td>
                  <td className="py-2.5 tabular-nums" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{d.headcount}</td>
                  <td className="py-2.5"><Pill tone={d.attrition>10?"bad":d.attrition>6?"gold":"good"}>{d.attrition}%</Pill></td>
                  <td className="py-2.5 tabular-nums" style={{ fontFamily: "IBM Plex Mono, monospace" }}>${d.avgSalary.toLocaleString()}</td>
                  <td className="py-2.5 tabular-nums" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{d.avgTenure} yr</td>
                  <td className="py-2.5 tabular-nums" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{d.avgPerf}</td>
                  <td className="py-2.5 tabular-nums" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{d.openRoles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Department health radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke={C.line} />
              <PolarAngleAxis dataKey="department" tick={{ fontSize: 10, fill: C.slate }} />
              <Radar name="Retention" dataKey="retention" stroke={C.forest} fill={C.forest} fillOpacity={0.28} />
              <Radar name="Performance" dataKey="performance" stroke={C.gold} fill={C.gold} fillOpacity={0.22} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: C.slate }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Headcount share</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={deptTable} dataKey="headcount" nameKey="department" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {deptTable.map((d,i)=><Cell key={i} fill={DEPT_COLOR[d.department]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Salary() {
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Compensation" title="Salary insights" note="Base salary, USD annualized" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI icon={DollarSign} label="Avg. base salary" value="$91.4K" delta="+2.4%" positive />
        <KPI icon={Wallet} label="Median compa-ratio" value="1.02" delta="within band" />
        <KPI icon={Gauge} label="Salary budget used" value="87%" delta="of FY plan" />
        <KPI icon={TrendingUp} label="Pay equity gap" value="3.1%" delta="-0.6 pts" positive deltaLabel="unadjusted, men vs. women" />
      </div>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Salary range by level (min · median · max)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={salaryLevels} margin={{ left: -10, right: 10 }}>
            <CartesianGrid vertical={false} stroke={C.line} />
            <XAxis dataKey="level" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v)=>`$${Math.round(v/1000)}K`} tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} formatter={(v)=>`$${v.toLocaleString()}`} />
            <Bar dataKey="min" name="Min" fill={C.slateSoft} radius={[3,3,0,0]} />
            <Bar dataKey="median" name="Median" fill={C.gold} radius={[3,3,0,0]} />
            <Bar dataKey="max" name="Max" fill={C.forest} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Compa-ratio by department</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={compaRatio} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid horizontal={false} stroke={C.line} />
              <XAxis type="number" domain={[0.7,1.3]} tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="department" width={110} tick={{ fontSize: 11, fill: C.ink }} axisLine={false} tickLine={false} />
              <ReferenceLine x={1} stroke={C.ink} strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ratio" name="Compa-ratio" radius={[0,4,4,0]}>
                {compaRatio.map((d,i)=><Cell key={i} fill={d.ratio<0.95?C.brick:d.ratio>1.1?C.gold:C.forest} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Pay parity — average base by department</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={genderPay} margin={{ left: -10, right: 10 }}>
              <CartesianGrid vertical={false} stroke={C.line} />
              <XAxis dataKey="department" tick={{ fontSize: 10, fill: C.slate }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v)=>`$${Math.round(v/1000)}K`} tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} formatter={(v)=>`$${v.toLocaleString()}`} />
              <Bar dataKey="men" name="Men" fill={C.slate} radius={[3,3,0,0]} />
              <Bar dataKey="women" name="Women" fill={C.gold} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Hiring() {
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Talent acquisition" title="Hiring trends" note="Requisitions, funnel, and source mix" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI icon={UserPlus} label="Hires this quarter" value="41" delta="+12%" positive />
        <KPI icon={Gauge} label="Avg. time to fill" value="34 days" delta="-4 days" positive />
        <KPI icon={TrendingUp} label="Offer acceptance" value="82%" delta="+3 pts" positive />
        <KPI icon={LayoutGrid} label="Open requisitions" value="47" delta="+9" />
      </div>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Hires vs. open requisitions</h3>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={hiringTrend} margin={{ left: -10, right: 10 }}>
            <CartesianGrid vertical={false} stroke={C.line} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="hires" name="Hires" stroke={C.forest} strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="openReqs" name="Open reqs" stroke={C.gold} strokeWidth={2} strokeDasharray="4 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Recruiting funnel (index, applied = 100)</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={hiringFunnel} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid horizontal={false} stroke={C.line} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="stage" width={90} tick={{ fontSize: 11, fill: C.ink }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Index" fill={C.forest} radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Source of hire</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={sourceOfHire} dataKey="value" nameKey="source" innerRadius={50} outerRadius={85} paddingAngle={3}>
                {sourceOfHire.map((s,i)=><Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip suffix="%" />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: C.slate }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Time to fill by department</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={timeToFill} margin={{ left: -10, right: 10 }}>
            <CartesianGrid vertical={false} stroke={C.line} />
            <XAxis dataKey="department" tick={{ fontSize: 10, fill: C.slate }} axisLine={false} tickLine={false} />
            <YAxis unit="d" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip suffix=" days" />} />
            <Bar dataKey="days" name="Days" radius={[4,4,0,0]}>
              {timeToFill.map((d,i)=><Cell key={i} fill={DEPT_COLOR[d.department]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function Performance() {
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Talent quality" title="Performance KPIs" note="Most recent review cycle" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI icon={Star} label="Avg. rating" value="3.74 / 5" delta="+0.08" positive />
        <KPI icon={TrendingUp} label="Engagement score" value="76" delta="+4 pts" positive />
        <KPI icon={UserCheck} label="Outstanding tier" value="15%" delta="+2 pts" positive />
        <KPI icon={TrendingDown} label="Needs improvement" value="6%" delta="-1 pt" positive />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Rating distribution</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={perfDistribution} dataKey="value" nameKey="band" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {perfDistribution.map((p,i)=><Cell key={i} fill={p.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip suffix="%" />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: C.slate }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Rating & engagement trend</h3>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={perfTrend} margin={{ left: -10, right: 10 }}>
              <CartesianGrid vertical={false} stroke={C.line} />
              <XAxis dataKey="cycle" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="l" domain={[2.5,4.5]} tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="r" orientation="right" domain={[50,100]} tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line yAxisId="l" type="monotone" dataKey="avg" name="Avg. rating" stroke={C.gold} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line yAxisId="r" type="monotone" dataKey="engagement" name="Engagement" stroke={C.forest} strokeWidth={2} strokeDasharray="4 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Performance by department</h3>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={perfByDept} margin={{ left: -10, right: 10 }}>
            <CartesianGrid vertical={false} stroke={C.line} />
            <XAxis dataKey="department" tick={{ fontSize: 10, fill: C.slate }} axisLine={false} tickLine={false} />
            <YAxis domain={[0,5]} tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="performance" name="Avg. rating" radius={[4,4,0,0]}>
              {perfByDept.map((d,i)=><Cell key={i} fill={DEPT_COLOR[d.department]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Retention by performance tier</h3>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={highPerformerRetention} layout="vertical" margin={{ left: 20, right: 30 }}>
            <CartesianGrid horizontal={false} stroke={C.line} />
            <XAxis type="number" domain={[0,100]} unit="%" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="tier" width={130} tick={{ fontSize: 11, fill: C.ink }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip suffix="%" />} />
            <Bar dataKey="retained" name="Retention rate" radius={[0,4,4,0]}>
              {highPerformerRetention.map((d,i)=><Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs mt-2" style={{ color: C.slate }}>Outstanding performers retain at 96% versus 61% for employees flagged needs-improvement — the performance/retention link is the strongest predictive signal in this dataset.</p>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------
   SHELL
------------------------------------------------------------------ */
const NAV = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "attrition", label: "Attrition", icon: TrendingDown },
  { key: "departments", label: "Departments", icon: Building2 },
  { key: "salary", label: "Salary", icon: DollarSign },
  { key: "hiring", label: "Hiring", icon: UserPlus },
  { key: "performance", label: "Performance", icon: Star },
];

export default function HRDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen w-full flex" style={{ background: C.paper, fontFamily: "IBM Plex Sans, sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r" style={{ borderColor: C.line, background: C.card }}>
        <div className="px-5 py-6 border-b" style={{ borderColor: C.line }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: C.ink }}>
              <span className="text-white text-xs" style={{ fontFamily: "Fraunces, serif" }}>P</span>
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: C.ink, fontFamily: "Fraunces, serif" }}>Pulse HR</div>
              <div className="text-[10px]" style={{ color: C.slate }}>People Analytics</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(n => {
            const active = tab === n.key;
            const Icon = n.icon;
            return (
              <button
                key={n.key}
                onClick={() => setTab(n.key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
                style={{
                  background: active ? C.ink : "transparent",
                  color: active ? "#fff" : C.slate,
                }}
              >
                <Icon size={16} strokeWidth={1.75} />
                {n.label}
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t text-[11px]" style={{ borderColor: C.line, color: C.slate }}>
          Data refreshed<br/><span style={{ color: C.ink, fontFamily: "IBM Plex Mono, monospace" }}>Jul 12, 2026 · 06:00</span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between px-5 md:px-8 py-4 border-b" style={{ borderColor: C.line, background: C.card }}>
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: C.ink }}>
              <span className="text-white text-xs" style={{ fontFamily: "Fraunces, serif" }}>P</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: C.ink, fontFamily: "Fraunces, serif" }}>Pulse HR</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm border rounded-md px-3 py-1.5 w-72" style={{ borderColor: C.line, color: C.slate }}>
            <Search size={14} />
            <span>Search employees, departments…</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 text-xs border rounded-md px-3 py-1.5" style={{ borderColor: C.line, color: C.ink }}>
              Last 12 months <ChevronDown size={13} />
            </button>
            <button className="hidden sm:flex items-center gap-1.5 text-xs rounded-md px-3 py-1.5 text-white" style={{ background: C.forest }}>
              <Download size={13} /> Export
            </button>
            <Bell size={16} color={C.slate} />
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white" style={{ background: C.gold }}>HR</div>
          </div>
        </header>

        {/* Mobile tab strip */}
        <div className="md:hidden flex overflow-x-auto gap-1 px-3 py-2 border-b" style={{ borderColor: C.line, background: C.card }}>
          {NAV.map(n => (
            <button
              key={n.key}
              onClick={() => setTab(n.key)}
              className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full"
              style={{ background: tab===n.key ? C.ink : C.slateSoft, color: tab===n.key ? "#fff" : C.slate }}
            >
              {n.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-5 md:p-8">
          {tab === "overview" && <Overview />}
          {tab === "attrition" && <Attrition />}
          {tab === "departments" && <Departments />}
          {tab === "salary" && <Salary />}
          {tab === "hiring" && <Hiring />}
          {tab === "performance" && <Performance />}
        </main>
      </div>
    </div>
  );
}

'use client'
const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
export default function StateDropdown({ value, onChange, id }:{ value:string; onChange:(s:string)=>void; id?:string }) {
  return (
    <select id={id} value={value} onChange={(e)=>onChange(e.target.value)} className="input px-3" aria-label="State">
      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

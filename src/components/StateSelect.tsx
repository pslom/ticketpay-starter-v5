'use client';
export default function StateSelect(props: { value: string; onChange: (v: string)=>void; id?: string }) {
  const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
  return (
    <select id={props.id} className="select" value={props.value} onChange={(e)=>props.onChange(e.target.value)}>
      {states.map(s=><option key={s} value={s}>{s}</option>)}
    </select>
  );
}

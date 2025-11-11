import { useState } from "react";
import { safeFetch } from "../utils/safeFetch";

export default function Assignments(){
  const [log,setLog]=useState<string>("");
  async function generate(){
    try{
      const payload = {
        standardCode: "SS.7.CG.1.3",
        standardName: "Analyze the structure of the U.S. Constitution",
        subject: "Civics", grade: "7",
        assessmentType: "MultipleChoice",
        questionCount: 10
      };
      const res = await safeFetch("/api/generateAssignment", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(payload) });
      setLog(JSON.stringify(res, null, 2));
    }catch(e:any){ setLog(String(e?.message||e)); }
  }
  return <div className="container"><div className="card">
    <h2>Assignment Generator</h2>
    <button onClick={generate}>Generate with AI</button>
    <pre style={{whiteSpace:'pre-wrap'}}>{log}</pre>
  </div></div>;
}

import React, { useEffect, useState } from "react";
import { apiJson } from "../../api/apiClient";

export default function LBWho() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr("");
      const json = await apiJson("/api/lb/who");
      setData(json);
    } catch (e) {
      setErr(String(e?.message || e));
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>LB 확인</h2>
      <button onClick={load}>새로고침</button>
      <div style={{ marginTop: 12 }}>
        {err ? <div style={{color:"crimson"}}>에러: {err}</div>
             : data ? <div>인스턴스: <b>{data.instance}</b></div>
                    : <div>불러오는 중…</div>}
      </div>
    </div>
  );
}

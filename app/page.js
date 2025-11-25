"use client";
import { useState, useEffect, useRef } from "react";
import SubjectLogo from "./components/SubjectLogo";

const SUBJECTS = ['math','science','english','history','cs'];

export default function Home() {
  const [prompt,setPrompt]=useState('');
  const [grade,setGrade]=useState(6);
  const [subject,setSubject]=useState('math');
  const [loading,setLoading]=useState(false);
  const [answer,setAnswer]=useState('');
  const [visibleAnswer,setVisibleAnswer]=useState('');
  const [gradeBarOpen,setGradeBarOpen]=useState(false);

  const hiddenRef=useRef(null);

  function animateAnswer(text){
    const words = text.split(/\s+/);
    let i=0;
    setVisibleAnswer('');
    function step(){
      if(i<words.length){
        setVisibleAnswer(prev=>prev?prev+' '+words[i]:words[i]);
        i++;
        setTimeout(step,200+Math.random()*120);
      }
    }
    step();
  }

  async function askAI(e){
    e?.preventDefault();
    if(!prompt.trim()) return;
    setLoading(true);
    setAnswer('');
    setVisibleAnswer('');
    try{
      const res = await fetch('/api/generate',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt,grade,subject})});
      const j = await res.json();
      const ans = j.answer||"";
      setAnswer(ans);
      animateAnswer(ans);
    }catch(err){ console.error(err) }
    finally{ setLoading(false); }
  }

  return (
    <div style={{padding:24,maxWidth:920,margin:'auto'}}>
      <header style={{textAlign:'center',marginBottom:20}}>
        <h1>▪︎●Ishfaq●Asim●Talha●▪︎</h1>
        <p style={{color:'#94a3b8'}}>Homework Helper — concise AI answers</p>
      </header>

      <main style={{display:'flex',flexDirection:'column',gap:16}}>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {SUBJECTS.map(s=>(
            <div key={s} onClick={()=>setSubject(s)} style={{cursor:'pointer', opacity:subject===s?1:0.5}}>
              <SubjectLogo subject={s}/>
            </div>
          ))}
        </div>

        <textarea rows={4} maxLength={800} placeholder="Enter homework question" value={prompt} onChange={e=>setPrompt(e.target.value)} style={{padding:12,borderRadius:12,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.03)',color:'#e6eef8'}}/>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{position:'relative'}}>
            <button onClick={()=>setGradeBarOpen(v=>!v)} style={{padding:'8px 12px',borderRadius:100,border:'1px solid rgba(255,255,255,0.04)',background:'transparent'}}>
              🎛 Grade: {grade}
            </button>
            {gradeBarOpen&&(
              <div style={{marginTop:6}}>
                <input type="range" min="1" max="10" value={grade} onChange={e=>setGrade(Number(e.target.value))}/>
              </div>
            )}
          </div>
          <button onClick={askAI} disabled={loading} style={{padding:'10px 16px',borderRadius:12,background:'linear-gradient(90deg,#7c3aed,#06b6d4)',color:'white',border:'none'}}>
            {loading?'Asking...':'Ask AI'}
          </button>
        </div>

        {answer&&(
          <div style={{marginTop:18,padding:14,borderRadius:12,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.03)'}}>
            <div style={{fontSize:16, minHeight:36, display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              <span>{visibleAnswer}</span>
              <span style={{animation:'blink 800ms steps(2) infinite'}}>▌</span>
            </div>
            <div ref={hiddenRef} style={{position:'absolute',left:-9999,opacity:0,pointerEvents:'none'}}>{answer}</div>
          </div>
        )}
      </main>

      <footer style={{textAlign:'center',marginTop:24,color:'#94a3b8',fontSize:13}}>
        Made with <span style={{color:'#ff5c7c',display:'inline-block',animation:'love 1.2s infinite'}}>❤</span> by Ishfaq · Asim · Talha
      </footer>

      <style jsx>{`
        @keyframes blink {50%{opacity:0}}
        @keyframes love {0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
      `}</style>
    </div>
  );
            }

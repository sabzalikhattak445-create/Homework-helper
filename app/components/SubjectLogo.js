"use client";
export default function SubjectLogo({ subject }) {
  const size = 40;

  const logoStyles = {
    container: `w-${size} h-${size} relative flex items-center justify-center rounded-full border-2 border-purple-500`,
    text: `absolute font-bold text-white text-sm`
  };

  switch(subject){
    case 'math':
      return (
        <div style={{width:size,height:size,position:'relative',borderRadius:'50%',border:'2px solid #7c3aed', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{fontWeight:'bold', fontSize:20, animation:'rotateMath 2s linear infinite'}}>+</div>
          <style jsx>{`
            @keyframes rotateMath{
              0%{ transform: rotate(0deg)}
              100%{ transform: rotate(360deg)}
            }
          `}</style>
        </div>
      );
    case 'science':
      return (
        <div style={{width:size,height:size,position:'relative'}}>
          <div style={{width:size,height:size, borderRadius:'50%', border:'2px solid #22d3ee', position:'absolute', top:0,left:0}}></div>
          <div style={{width:8,height:8,background:'#22d3ee',borderRadius:'50%',position:'absolute',top:'50%',left:'50%',transform:'translate(-50%, -50%)', animation:'orbit 1.5s linear infinite'}}></div>
          <style jsx>{`
            @keyframes orbit{
              0%{ transform: rotate(0deg) translateX(14px) rotate(0deg)}
              100%{ transform: rotate(360deg) translateX(14px) rotate(-360deg)}
            }
          `}</style>
        </div>
      );
    case 'english':
      return (
        <div style={{width:size,height:size, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:16, animation:'pulseABC 1.5s infinite'}}>
          ABC
          <style jsx>{`
            @keyframes pulseABC{
              0%,100%{ transform: scale(1)}
              50%{ transform: scale(1.2)}
            }
          `}</style>
        </div>
      );
    case 'history':
      return (
        <div style={{width:size,height:size, position:'relative', border:'2px solid #facc15', borderRadius:'50%'}}>
          <div style={{width:6,height:12, background:'#facc15', position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'flipBook 1s infinite'}}></div>
          <style jsx>{`
            @keyframes flipBook{
              0%,100%{ transform: translate(-50%,-50%) rotateY(0deg)}
              50%{ transform: translate(-50%,-50%) rotateY(180deg)}
            }
          `}</style>
        </div>
      );
    case 'cs':
      return (
        <div style={{width:size,height:size, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:18, animation:'spinCS 1.5s linear infinite'}}>
          &lt;&gt;
          <style jsx>{`
            @keyframes spinCS{
              0%{ transform: rotate(0deg)}
              100%{ transform: rotate(360deg)}
            }
          `}</style>
        </div>
      );
    default:
      return <div style={{width:size,height:size, background:'#555', borderRadius:'50%'}}></div>;
  }
}

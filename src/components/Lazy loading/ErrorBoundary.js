import logo from "../../Images/logo.png";
function ErrorFallback({error, resetErrorBoundary}) {

  const handleClick=()=>{
    window.location.reload(false)
  }
    return (
      <div style={{background:"lightgrey",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}} role="alert">
        <img width="120px" src={logo}/>
        <p style={{fontSize:"32px"}}>Something went wrong</p>
       <button style={{marginTop:"20px",padding:"10px 16px",background:"#1B1464",color:"white",fontSize:"16px",border:"none",cursor:"pointer"}} onClick={handleClick}>Click to reload!</button>
      </div>
    )
  }
  export default ErrorFallback;
  
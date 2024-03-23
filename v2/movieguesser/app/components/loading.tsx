import { useRef } from "react"



const LoadingCover = (props: any) => {
  return <>
    {props.progress !== 100 && <div className="absolute top-0 left-0 bg-primary-800 w-full h-full z-10 flex flex-col justify-center items-center">
      <div className="h-2 w-32 bg-slate-300 rounded-full overflow-hidden">
        <div className="h-full bg-slate-600 transition-all" style={{width: `${props.progress}%`}}></div>
      </div>
    </div>}
  </>
}

export default LoadingCover
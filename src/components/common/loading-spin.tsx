import { LoaderCircle } from "lucide-react"




const LoadingSpin:React.FC<{size?:number}> = ({size})=>{
    return (
        <>
         <LoaderCircle size={size} className="animate-spin"/>
        </>
    )
}

export default LoadingSpin
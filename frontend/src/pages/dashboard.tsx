import { useNavigate } from "react-router-dom"

export function Dashboard(){
    const navigate=useNavigate();
    function bookorder(){
        navigate("/orderbook")

    }
    return<div>
        dashboard
        <div>
        <button onClick={bookorder} className="bg-black text-white rounded-md"> book your order</button>

        </div>
    </div>
}
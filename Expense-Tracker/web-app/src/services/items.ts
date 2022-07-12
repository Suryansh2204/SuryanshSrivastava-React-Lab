import axios from "axios";
import iItems from "../models/iItems";

const baseUrl=process.env.REACT_APP_BASE_URL;

const getItems=async () => {
    const response = await axios.get<iItems[]>(`${baseUrl}/items`)
    return response.data;   
}

const addItem=async(item : Omit<iItems,'id'>)=>{
    const response=await axios.post<iItems>(`${baseUrl}/items`,item,{
        headers:{
            'Content-Type':'application/json'
        }
    });
    return response.data;
};

export {getItems, addItem};
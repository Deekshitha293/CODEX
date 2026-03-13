import { useState } from 'react';
import { Button, Input } from '../components/ui';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
export default function(){const {addProduct}=useData();const nav=useNavigate();const [form,setForm]=useState({name:'',category:'',price:'',stock:'',expiry_date:'',barcode:''});
const save=()=>{addProduct({name:form.name,category:form.category,price:Number(form.price),stock:Number(form.stock),expiry_date:form.expiry_date,barcode:form.barcode});nav('/inventory');};
return <main className='max-w-md mx-auto min-h-screen p-4 bg-brand-light'><h1 className='font-bold text-xl'>Add New Product</h1><div className='space-y-3 mt-4'>{Object.entries({name:'Organic Milk 1L',category:'Dairy',price:'₹60',stock:'24',expiry_date:'2023-10-25',barcode:'890123456789'}).map(([k,p])=><Input key={k} placeholder={p} value={(form as any)[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})}/>)}</div><Button className='w-full mt-4' onClick={save}>Save Product</Button><button className='w-full mt-2' onClick={()=>nav('/inventory')}>Cancel</button></main>}

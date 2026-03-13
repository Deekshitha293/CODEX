import { Invoice, Product } from './types';

export const initialProducts: Product[] = [
  { id:1,name:'Whole Wheat Flour',category:'Grocery',price:55,stock:12,expiry_date:'2026-12-15',barcode:'890123456789' },
  { id:2,name:'Extra Virgin Olive Oil',category:'Essentials',price:799,stock:85,expiry_date:'2027-05-02',barcode:'890123456780' },
  { id:3,name:'Organic Whole Milk 1L',category:'Dairy',price:60,stock:24,expiry_date:new Date(Date.now()+2*86400000).toISOString(),barcode:'890123456781' },
  { id:4,name:'Greek Yogurt 500g',category:'Dairy',price:120,stock:12,expiry_date:new Date(Date.now()+4*86400000).toISOString(),barcode:'890123456782' },
  { id:5,name:'Artisan Sourdough',category:'Bakery',price:180,stock:8,expiry_date:new Date(Date.now()+6*86400000).toISOString(),barcode:'890123456783' }
];

export const initialInvoices: Invoice[] = [
  { id:'INV-20240601', date:new Date().toISOString(), total:3300, customer:'Rahul', items:[{productId:3,title:'Organic Whole Milk 1L',subtitle:'Fresh milk',price:60,quantity:32}] },
  { id:'INV-20240602', date:new Date(Date.now()-86400000).toISOString(), total:2450, customer:'Priya', items:[{productId:1,title:'Whole Wheat Flour',subtitle:'Atta',price:55,quantity:20}] }
];

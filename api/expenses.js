import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
export default async function handler(req,res){
 try{
  if(req.method==='GET'){const rows=await sql('SELECT id, expense_date, description, amount, category, payment_method, notes, created_at FROM expenses ORDER BY expense_date DESC, id DESC LIMIT 100');return res.status(200).json(rows)}
  if(req.method==='POST'){const b=req.body||{},v=Number(b.amount);if(!b.description?.trim()||!Number.isFinite(v)||v<=0)return res.status(400).json({error:'Descrição e valor válido são obrigatórios.'});
   const rows=await sql('INSERT INTO expenses (expense_date,description,amount,category,payment_method,notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,expense_date,description,amount,category,payment_method,notes,created_at',[b.expense_date||new Date().toISOString().slice(0,10),b.description.trim(),v,b.category||null,b.payment_method||null,b.notes||null]);return res.status(201).json(rows[0])}
  res.setHeader('Allow',['GET','POST']);return res.status(405).json({error:'Método não permitido.'})
 }catch(e){console.error(e);return res.status(500).json({error:'Erro ao acessar o banco de dados.'})}
}
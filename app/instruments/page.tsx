import { supabase } from "@/lib/supabaseClient";

export default async function Instruments() {
  const { data: customers } = await supabase.from("customer").select();

  return <pre>{JSON.stringify(customers, null, 2)}</pre>
}
import { useState } from 'react'
export default function useDropdown(){ 
  const [open, setOpen] = useState(false)
  const toggle = ()=> setOpen(o=>!o)
  return { open, setOpen, toggle }
}

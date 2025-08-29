'use client'
import { ButtonHTMLAttributes } from 'react'
type Variant='primary'|'secondary'
type Size='sm'|'md'|'lg'
const sizes:Record<Size,string>={sm:'px-3 py-2 text-sm',md:'px-5 py-3 text-base',lg:'px-6 py-4 text-lg'}
const variants:Record<Variant,string>={primary:'btn btn-primary',secondary:'btn btn-secondary'}
export function Button({variant='primary',size='md',className='',...rest}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:Variant,size?:Size}){return <button className={`${variants[variant]} ${sizes[size]} ${className}`} {...rest}/>}

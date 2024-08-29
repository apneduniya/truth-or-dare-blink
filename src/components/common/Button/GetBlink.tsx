


export default function GetBlinkButton({ onClick, ...props }: { onClick: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button 
            className={`inline-flex ${props.disabled ? 'opacity-50' : 'animate-shimmer'} items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 py-3 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50`} 
            onClick={onClick}
            {...props}
        >
            {props.disabled ? 'Connect your wallet first' : 'Generate blink'}
        </button>
    )
}
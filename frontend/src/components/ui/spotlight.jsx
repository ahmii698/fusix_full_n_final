export const Spotlight = ({ className, fill }) => {
  return (
    <div className={`absolute inset-0 z-0 opacity-30 pointer-events-none ${className || ''}`}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
    </div>
  )
}